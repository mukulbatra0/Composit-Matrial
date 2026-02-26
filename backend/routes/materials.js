const express = require('express');
const router = express.Router();
const Fiber = require('../models/Fiber');
const Matrix = require('../models/Matrix');

// GET all fibers
router.get('/fibers', async (req, res) => {
  try {
    const fibers = await Fiber.find().sort({ name: 1 });
    res.json(fibers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all matrices
router.get('/matrices', async (req, res) => {
  try {
    const matrices = await Matrix.find().sort({ name: 1 });
    res.json(matrices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single fiber by ID
router.get('/fibers/:id', async (req, res) => {
  try {
    const fiber = await Fiber.findById(req.params.id);
    if (!fiber) {
      return res.status(404).json({ message: 'Fiber not found' });
    }
    res.json(fiber);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single matrix by ID
router.get('/matrices/:id', async (req, res) => {
  try {
    const matrix = await Matrix.findById(req.params.id);
    if (!matrix) {
      return res.status(404).json({ message: 'Matrix not found' });
    }
    res.json(matrix);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
