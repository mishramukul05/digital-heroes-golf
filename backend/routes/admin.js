const express = require('express');
const router = express.Router();
const Draw = require('../models/Draw');
const User = require('../models/User');
const Charity = require('../models/Charity');
const { isAdmin } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const draws = await Draw.find();
    const totalPrizePool = draws.reduce((sum, draw) => sum + draw.prizePoolTotal, 0);
    const charities = await Charity.find();
    const totalCharityContributions = charities.reduce((sum, charity) => sum + charity.totalRaised, 0);
    
    res.json({ totalUsers, totalPrizePool, totalCharityContributions });
  } catch (error) {
    res.status(500).json({ error: 'Server error tracking stats' });
  }
});

// GET /api/admin/users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }, 'name email subscriptionStatus selectedCharityId').populate('selectedCharityId', 'name');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// GET /api/admin/charities
router.get('/charities', isAdmin, async (req, res) => {
  try {
    const charities = await Charity.find();
    res.json(charities);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching charities' });
  }
});

// POST /api/admin/charities
router.post('/charities', isAdmin, async (req, res) => {
  try {
    const newCharity = new Charity(req.body);
    await newCharity.save();
    res.status(201).json(newCharity);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating charity' });
  }
});

// DELETE /api/admin/charities/:id
router.delete('/charities/:id', isAdmin, async (req, res) => {
  try {
    await Charity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Charity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting charity' });
  }
});

// GET /api/admin/pending-verifications
router.get('/pending-verifications', isAdmin, async (req, res) => {
  try {
    // Find all draws that have winners with a 'pending' verification status and proofImage
    const draws = await Draw.find({
      'winners.verificationStatus': 'pending',
      'winners.proofImage': { $exists: true, $ne: null }
    }).populate('winners.userId', 'name email');

    let pendingWinners = [];
    draws.forEach(draw => {
      draw.winners.forEach(winner => {
        if (winner.verificationStatus === 'pending' && winner.proofImage) {
          pendingWinners.push({
            drawId: draw._id,
            drawMonth: draw.month,
            winnerId: winner._id,
            userId: winner.userId._id,
            userName: winner.userId.name,
            matchTier: winner.matchTier,
            prizeAmount: winner.prizeAmount,
            proofImage: winner.proofImage
          });
        }
      });
    });

    res.json(pendingWinners);
  } catch (error) {
    console.error('Error fetching pending verifications', error);
    res.status(500).json({ error: 'Server error fetching pending verifications' });
  }
});

// PUT /api/admin/draws/:drawId/approve - Approve or reject a winner
router.put('/draws/:drawId/approve', isAdmin, async (req, res) => {
  const { drawId } = req.params;
  const { userId, action } = req.body; // action: 'approve' or 'reject'

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action specified.' });
  }

  try {
    const draw = await Draw.findById(drawId);
    if (!draw) {
      return res.status(404).json({ error: 'Draw not found.' });
    }

    const winner = draw.winners.find(w => w.userId.toString() === userId);
    if (!winner) {
      return res.status(404).json({ error: 'Winner not found in this draw.' });
    }

    if (action === 'approve') {
      winner.verificationStatus = 'approved';
      // In a real app, you'd trigger payment here, then update to 'paid'.
      // For this example, we'll simulate it by setting it directly.
      setTimeout(async () => {
        try {
          const updatedDraw = await Draw.findById(drawId);
          const winnerToPay = updatedDraw.winners.find(w => w.userId.toString() === userId);
          if (winnerToPay) {
            winnerToPay.verificationStatus = 'paid';
            await updatedDraw.save();
            console.log(`User ${userId} has been marked as paid.`);
          }
        } catch (err) {
          console.error('Error processing automated payment verification:', err);
        }
      }, 5000); // 5 second delay to simulate payment processing

    } else { // 'reject'
      winner.verificationStatus = 'rejected';
    }

    await draw.save();

    res.json({
      message: `Winner ${action}d successfully.`,
      draw,
    });

  } catch (error) {
    console.error('Error updating winner status:', error);
    res.status(500).json({ error: 'Server error while updating winner status.' });
  }
});

// PUT /api/admin/users/:id - Edit user profile info/subscription
router.put('/users/:id', isAdmin, async (req, res) => {
  try {
    const { name, email, subscriptionStatus } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (name) user.name = name;
    if (email) user.email = email;
    if (subscriptionStatus) user.subscriptionStatus = subscriptionStatus;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// PUT /api/admin/charities/:id - Edit a charity
router.put('/charities/:id', isAdmin, async (req, res) => {
  try {
    const { name, description, imageUrl, isActive } = req.body;
    const charity = await Charity.findById(req.params.id);
    if (!charity) return res.status(404).json({ error: 'Charity not found' });
    if (name) charity.name = name;
    if (description) charity.description = description;
    if (imageUrl) charity.imageUrl = imageUrl;
    if (isActive !== undefined) charity.isActive = isActive;
    await charity.save();
    res.json(charity);
  } catch (err) {
    res.status(500).json({ error: 'Error updating charity' });
  }
});

module.exports = router;