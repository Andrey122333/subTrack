const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// CREATE
router.post('/', async (req, res) => {
  try {
    const newSub = new Subscription(req.body);
    const savedSub = await newSub.save();
    res.status(201).json(savedSub);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ (all)
router.get('/', async (req, res) => {
  try {
    const subs = await Subscription.find();
    res.status(200).json(subs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ (one by id)
router.get('/:id', async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(200).json(sub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updatedSub = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSub) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(200).json(updatedSub);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deletedSub = await Subscription.findByIdAndDelete(req.params.id);
    if (!deletedSub) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(200).json({ message: 'Subscription deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
