const express = require('express');
const router = express.Router();
const Charity = require('../models/Charity');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET all active charities
router.get('/', async (req, res) => {
  try {
    const charities = await Charity.find({ isActive: true });
    res.json(charities);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching charities' });
  }
});

// PUT user's selected charity
router.put('/select', verifyToken, async (req, res) => {
  try {
    const { charityId, percentage } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.selectedCharityId = charityId;
    if (percentage) {
      user.charityPercentage = Math.max(10, percentage);
    }
    
    await user.save();
    res.json({ message: 'Charity updated successfully', selectedCharityId: user.selectedCharityId, charityPercentage: user.charityPercentage });
  } catch (error) {
    res.status(500).json({ message: 'Error updating charity' });
  }
});

// ADMIN: Add a new charity
router.post('/', isAdmin, async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    const newCharity = new Charity({ name, description, imageUrl });
    await newCharity.save();
    res.status(201).json(newCharity);
  } catch (error) {
    res.status(500).json({ message: 'Error creating charity' });
  }
});

module.exports = router;