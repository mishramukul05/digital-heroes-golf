const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// POST /api/scores - Add a new score with the 5-rolling logic
router.post('/', async (req, res) => {
  try {
    const { userId, score, date } = req.body;

    // 1. Validate the score range (1-45) 
    if (score < 1 || score > 45) {
      return res.status(400).json({ message: 'Score must be between 1 and 45' });
    }

    // 2. Save the new score
    const newScore = new Score({ userId, score, date });
    await newScore.save();

    // 3. The 5-Score Rolling Logic [cite: 48, 49]
    // Find all scores for this user, sorted by date (newest first)
    const userScores = await Score.find({ userId }).sort({ date: -1 });

    // If they have more than 5 scores, delete the oldest ones
    if (userScores.length > 5) {
      const scoresToDelete = userScores.slice(5); // Get everything after the 5th score
      const idsToDelete = scoresToDelete.map(s => s._id);
      
      await Score.deleteMany({ _id: { $in: idsToDelete } });
    }

    // 4. Fetch and return the updated top 5 scores (most recent first) [cite: 50]
    const updatedScores = await Score.find({ userId }).sort({ date: -1 });
    res.status(201).json(updatedScores);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/scores/:userId - Get scores for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const scores = await Score.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(scores);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;