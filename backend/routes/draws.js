const express = require('express');
const router = express.Router();
const Draw = require('../models/Draw');
const User = require('../models/User');
const Score = require('../models/Score');
const { isAdmin } = require('../middleware/auth');

// GET /api/draws/ - Fetch recent draws for admin
router.get('/', isAdmin, async (req, res) => {
  try {
    const draws = await Draw.find().sort({ createdAt: -1 }).limit(10);
    res.json(draws);
  } catch (error) {
    console.error('Error fetching draws:', error);
    res.status(500).json({ error: 'Server error retrieving draws.' });
  }
});

// A helper function to generate unique random numbers
const generateWinningNumbers = () => {
  const winners = new Set();
  while (winners.size < 5) {
    winners.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(winners);
};

// POST /api/draws/run - Admin-only route to execute a monthly draw simulation
router.post('/run', isAdmin, async (req, res) => {
  try {
    // Step 1: Generate 5 random winning numbers
    const winningNumbers = generateWinningNumbers();

    // Step 2: Fetch all active users and their latest 5 scores
    const activeUsers = await User.find({ subscriptionStatus: 'active' });
    
    const userScores = await Promise.all(
      activeUsers.map(async (user) => {
        const scores = await Score.find({ userId: user._id })
            .sort({ date: -1, _id: -1 })
            .limit(5);
        return { user, scores: scores.map(s => s.score) };
      })
    );

    // Step 3 & 4: Compare scores and filter winners
    const match5 = [];
    const match4 = [];
    const match3 = [];

    userScores.forEach(({ user, scores }) => {
      // Ensure golf scores count distinctly vs the distinct winning numbers pool
      const uniqueScores = [...new Set(scores)];
      const matches = uniqueScores.filter(score => winningNumbers.includes(score)).length;
      if (matches === 5) match5.push(user);
      else if (matches === 4) match4.push(user);
      else if (matches === 3) match3.push(user);
    });

    // Step 5: Calculate prize pool distribution
    // A fixed portion per active user goes into base pool. Default seeded to 1000 for empty databases.
    const basePrizePool = activeUsers.length > 0 ? activeUsers.length * 5 : 1000;
    
    const lastPublishedDraw = await Draw.findOne({ status: 'published' }).sort({ createdAt: -1 });
    let rolloverAmount = 0;
    if (lastPublishedDraw && !lastPublishedDraw.jackpotClaimed) {
      rolloverAmount = (lastPublishedDraw.basePrizePool * 0.40) + (lastPublishedDraw.rolloverAmount || 0);
    }
    const currentJackpotPot = (basePrizePool * 0.40) + rolloverAmount;
    const currentMatch4Pot = (basePrizePool * 0.35);
    const currentMatch3Pot = (basePrizePool * 0.25);
    
    const totalPrizePool = basePrizePool + rolloverAmount;

    const prizeTier = {
      match5: match5.length > 0 ? currentJackpotPot / match5.length : 0,
      match4: match4.length > 0 ? currentMatch4Pot / match4.length : 0,
      match3: match3.length > 0 ? currentMatch3Pot / match3.length : 0,
    };
    
    const winners = [
      ...match5.map(user => ({ userId: user._id, matchTier: 5, prizeAmount: prizeTier.match5 })),
      ...match4.map(user => ({ userId: user._id, matchTier: 4, prizeAmount: prizeTier.match4 })),
      ...match3.map(user => ({ userId: user._id, matchTier: 3, prizeAmount: prizeTier.match3 })),
    ];

    // Step 6: Save this data to a new Draw document
    const month = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const newDraw = new Draw({
      month,
      winningNumbers,
      prizePoolTotal: totalPrizePool,
      basePrizePool,
      rolloverAmount,
      jackpotClaimed: match5.length > 0,
      status: 'simulation',
      winners,
    });

    await newDraw.save();

    // Return the simulation results
    res.status(201).json({
      message: 'Draw simulation completed successfully.',
      simulation: newDraw,
    });

  } catch (error) {
    console.error('Error running draw simulation:', error);
    res.status(500).json({ error: 'Server error while running draw.' });
  }
});

// PUT /api/draws/verify/:drawId - User submits proof of win
router.put('/verify/:drawId', async (req, res) => {
  const { drawId } = req.params;
  const { userId, proofImage } = req.body; // proofImage is a Base64 string

  if (!proofImage) {
    return res.status(400).json({ error: 'Proof image is required.' });
  }

  try {
    const draw = await Draw.findById(drawId);
    if (!draw) {
      return res.status(404).json({ error: 'Draw not found.' });
    }

    const winner = draw.winners.find(w => w.userId.toString() === userId);
    if (!winner) {
      return res.status(404).json({ error: 'You are not a winner in this draw.' });
    }

    winner.verificationStatus = 'pending';
    winner.proofImage = proofImage;

    await draw.save();

    res.json({
      message: 'Proof submitted successfully. Awaiting verification.',
      winner,
    });

  } catch (error) {
    console.error('Error submitting proof:', error);
    res.status(500).json({ error: 'Server error while submitting proof.' });
  }
});

// GET /api/draws/user/:userId/winnings - Fetch a user's winnings
router.get('/user/:userId/winnings', async (req, res) => {
  try {
    const { userId } = req.params;
    const draws = await Draw.find({ 'winners.userId': userId });
    
    // Extract simply the relevant winner information
    const userWinnings = draws.map(draw => {
      const winnerData = draw.winners.find(w => w.userId.toString() === userId);
      return {
        _id: winnerData._id,
        drawId: draw._id,
        month: draw.month,
        matchTier: winnerData.matchTier,
        prizeAmount: winnerData.prizeAmount,
        verificationStatus: winnerData.verificationStatus
      };
    });

    res.json(userWinnings);
  } catch (error) {
    console.error('Error fetching user winnings', error);
    res.status(500).json({ error: 'Server error retrieving winnings.' });
  }
});

// PUT /api/draws/verify-audit/:drawId/:winnerId - Admin approves/rejects/pays a winner
router.put('/verify-audit/:drawId/:winnerId', isAdmin, async (req, res) => {
  const { drawId, winnerId } = req.params;
  const { status } = req.body; // 'approved', 'rejected', 'paid'

  if (!['approved', 'rejected', 'paid'].includes(status)) {
    return res.status(400).json({ error: 'Invalid sort status' });
  }

  try {
    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ error: 'Draw not found.' });

    const winner = draw.winners.id(winnerId); // Since subdocuments have _id
    if (!winner) return res.status(404).json({ error: 'Winner not found.' });

    winner.verificationStatus = status;
    await draw.save();

    res.json({ message: `Winner status updated to ${status}`, winner });
  } catch (error) {
    console.error('Error auditing winner:', error);
    res.status(500).json({ error: 'Server error while auditing winner.' });
  }
});

// PUT /api/draws/publish/:drawId - Admin publishes simulation logic
router.put('/publish/:drawId', isAdmin, async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.drawId);
    if (!draw) return res.status(404).json({ error: 'Draw not found' });
    
    draw.status = 'published';
    await draw.save();
    
    res.json({ message: 'Draw published successfully', draw });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET /api/draws/user/:userId/stats - Fetch user's overall draw stats
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Find published draws since user joined
    const totalDraws = await Draw.countDocuments({
      status: 'published',
      createdAt: { $gte: user.createdAt || new Date(0) }
    });

    res.json({ drawsEntered: totalDraws });
  } catch (error) {
    console.error('Error fetching stats', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

module.exports = router;
