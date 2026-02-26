const express = require('express');
const router = express.Router();
const LoadDeflectionData = require('../models/LoadDeflectionData');
const { 
  generateLoadDeflectionCurve, 
  calculatePropertiesFromFVF 
} = require('../utils/loadDeflectionCalculator');

// GET load-deflection curve data for specific parameters
router.get('/curve', async (req, res) => {
  try {
    const { fiber_type, matrix_type, fvf } = req.query;
    
    if (!fiber_type || !matrix_type || !fvf) {
      return res.status(400).json({ 
        message: 'fiber_type, matrix_type, and fvf (fiber volume fraction) are required' 
      });
    }

    const fiberVolumeFraction = parseFloat(fvf);
    
    // Calculate properties based on FVF
    const properties = calculatePropertiesFromFVF(
      fiber_type, 
      matrix_type, 
      fiberVolumeFraction,
      { thickness: 3, width: 25, span: 50 }
    );

    // Generate curve data
    const curveData = generateLoadDeflectionCurve({
      maxLoad: properties.maxLoad,
      maxDeflection: properties.maxDeflection,
      linearRegionEnd: properties.linearRegionEnd,
      points: 100
    });

    res.json({
      fiber_type,
      matrix_type,
      fiber_volume_fraction: fiberVolumeFraction,
      properties,
      curve_data: curveData
    });
  } catch (error) {
    console.error('Error generating load-deflection curve:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET multiple curves for comparison (different FVFs)
router.get('/compare', async (req, res) => {
  try {
    const { fiber_type, matrix_type, fvf_list } = req.query;
    
    if (!fiber_type || !matrix_type || !fvf_list) {
      return res.status(400).json({ 
        message: 'fiber_type, matrix_type, and fvf_list are required' 
      });
    }

    const fvfArray = fvf_list.split(',').map(f => parseFloat(f.trim()));
    const results = [];

    for (const fvf of fvfArray) {
      const properties = calculatePropertiesFromFVF(
        fiber_type, 
        matrix_type, 
        fvf,
        { thickness: 3, width: 25, span: 50 }
      );

      const curveData = generateLoadDeflectionCurve({
        maxLoad: properties.maxLoad,
        maxDeflection: properties.maxDeflection,
        linearRegionEnd: properties.linearRegionEnd,
        points: 100
      });

      results.push({
        fvf,
        properties,
        curve_data: curveData
      });
    }

    res.json({
      fiber_type,
      matrix_type,
      comparisons: results
    });
  } catch (error) {
    console.error('Error generating comparison curves:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET summary table data for different FVFs
router.get('/summary', async (req, res) => {
  try {
    const { fiber_type, matrix_type } = req.query;
    
    if (!fiber_type || !matrix_type) {
      return res.status(400).json({ 
        message: 'fiber_type and matrix_type are required' 
      });
    }

    // Generate data for common FVF values
    const fvfValues = [10, 20, 30, 40, 50, 60];
    const summaryData = [];

    for (const fvf of fvfValues) {
      const properties = calculatePropertiesFromFVF(
        fiber_type, 
        matrix_type, 
        fvf,
        { thickness: 3, width: 25, span: 50 }
      );

      summaryData.push({
        fiber_volume_fraction: fvf,
        max_load: properties.maxLoad,
        max_deflection: properties.maxDeflection,
        flexural_strength: properties.flexuralStrength,
        flexural_modulus: properties.flexuralModulus,
        linear_region_end: properties.linearRegionEnd
      });
    }

    res.json({
      fiber_type,
      matrix_type,
      specimen_dimensions: {
        thickness: 3,
        width: 25,
        span: 50,
        units: 'mm'
      },
      summary: summaryData
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
