const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const { verifyToken } = require('../middleware/auth');

// POST /api/scores - Add a new score with the 5-rolling logic
router.post('/', verifyToken, async (req, res) => {
  try {
    const { userId, score } = req.body;

    // Optional: verify that the user is submitting for themselves
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // 1. Validate the score range (1-45) 
    if (score < 1 || score > 45) {
      return res.status(400).json({ message: 'Score must be between 1 and 45' });
    }

    // 2. Save the new score using server-side Date to prevent past-date exploits
    const newScore = new Score({ userId, score, date: new Date() });
    await newScore.save();

    // 3. The 5-Score Rolling Logic
    // Atomically find the top 5 most recent scores using a deterministic sort
    const topScores = await Score.find({ userId }).sort({ date: -1, _id: -1 }).limit(5).select('_id');
    const topScoreIds = topScores.map(s => s._id);

    // Atomically delete ANY scores for this user that are NOT in their top 5
    // This prevents race conditions from appending multiple scores and missing cleanup
    await Score.deleteMany({ userId, _id: { $nin: topScoreIds } });

    // 4. Fetch and return the updated top 5 scores (most recent first)
    const updatedScores = await Score.find({ userId }).sort({ date: -1, _id: -1 });
    res.status(201).json(updatedScores);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/scores/:userId - Get scores for a specific user
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        if (req.user.userId !== req.params.userId && req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Forbidden' });
        }
        const scores = await Score.find({ userId: req.params.userId }).sort({ date: -1, _id: -1 });
        res.json(scores);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/scores/:id - Admin can edit a score
router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const { score } = req.body;
        if (score < 1 || score > 45) {
            return res.status(400).json({ message: 'Score must be between 1 and 45' });
        }
        
        const existingScore = await Score.findById(req.params.id);
        if (!existingScore) return res.status(404).json({ message: 'Score not found' });
        
        existingScore.score = score;
        await existingScore.save();
        res.json(existingScore);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE /api/scores/:id - Admin can delete a score
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        await Score.findByIdAndDelete(req.params.id);
        res.json({ message: 'Score deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;