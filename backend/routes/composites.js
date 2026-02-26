const express = require('express');
const router = express.Router();
const CompositeData = require('../models/CompositeData');

// GET all unique fiber types
router.get('/fiber-types', async (req, res) => {
  try {
    const fiberTypes = await CompositeData.distinct('fiber_type');
    res.json(fiberTypes.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all unique matrix types
router.get('/matrix-types', async (req, res) => {
  try {
    const matrixTypes = await CompositeData.distinct('matrix_type');
    res.json(matrixTypes.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all unique orientations
router.get('/orientations', async (req, res) => {
  try {
    const orientations = await CompositeData.distinct('orientation');
    res.json(orientations.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET filtered composite data
router.get('/data', async (req, res) => {
  try {
    const { fiber_type, matrix_type, orientation } = req.query;
    
    const filter = {};
    if (fiber_type) filter.fiber_type = fiber_type;
    if (matrix_type) filter.matrix_type = matrix_type;
    if (orientation) filter.orientation = orientation;
    
    const data = await CompositeData.find(filter).sort({ fiber_content: 1 });
    res.json(data);
  } catch (error) {
    console.error('Error in /data:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET statistics for a specific combination
router.get('/stats', async (req, res) => {
  try {
    const { fiber_type, matrix_type, orientation } = req.query;
    
    const filter = {};
    if (fiber_type) filter.fiber_type = fiber_type;
    if (matrix_type) filter.matrix_type = matrix_type;
    if (orientation) filter.orientation = orientation;
    
    const data = await CompositeData.find(filter);
    
    if (data.length === 0) {
      return res.json({ count: 0, message: 'No data found for this combination' });
    }
    
    const dataWithModulus = data.filter(d => d.youngs_modulus != null && !isNaN(d.youngs_modulus));
    
    const stats = {
      count: data.length,
      tensile_strength: {
        min: Math.min(...data.map(d => d.tensile_strength)),
        max: Math.max(...data.map(d => d.tensile_strength)),
        avg: data.reduce((sum, d) => sum + d.tensile_strength, 0) / data.length
      },
      youngs_modulus: dataWithModulus.length > 0 ? {
        min: Math.min(...dataWithModulus.map(d => d.youngs_modulus)),
        max: Math.max(...dataWithModulus.map(d => d.youngs_modulus)),
        avg: dataWithModulus.reduce((sum, d) => sum + d.youngs_modulus, 0) / dataWithModulus.length
      } : {
        min: 0,
        max: 0,
        avg: 0
      },
      fiber_content_range: {
        min: Math.min(...data.map(d => d.fiber_content)),
        max: Math.max(...data.map(d => d.fiber_content))
      }
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error in /stats:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


// GET sample data for debugging
router.get('/sample', async (req, res) => {
  try {
    const sample = await CompositeData.findOne();
    const count = await CompositeData.countDocuments();
    res.json({
      total_documents: count,
      sample_document: sample
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all data (for debugging)
router.get('/all', async (req, res) => {
  try {
    const data = await CompositeData.find().limit(10);
    res.json({
      count: await CompositeData.countDocuments(),
      first_10: data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
