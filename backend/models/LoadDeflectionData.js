const mongoose = require('mongoose');

const loadDeflectionDataSchema = new mongoose.Schema({
  fiber_type: {
    type: String,
    required: true,
    trim: true
  },
  matrix_type: {
    type: String,
    required: true,
    trim: true
  },
  fiber_volume_fraction: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    description: 'Fiber volume fraction in %'
  },
  specimen_thickness: {
    type: Number,
    required: true,
    description: 'Specimen thickness in mm'
  },
  specimen_width: {
    type: Number,
    required: true,
    description: 'Specimen width in mm'
  },
  span_length: {
    type: Number,
    required: true,
    description: 'Support span length in mm'
  },
  max_load: {
    type: Number,
    required: true,
    description: 'Maximum flexural load in N'
  },
  max_deflection: {
    type: Number,
    required: true,
    description: 'Maximum deflection at failure in mm'
  },
  flexural_strength: {
    type: Number,
    description: 'Flexural strength in MPa'
  },
  flexural_modulus: {
    type: Number,
    description: 'Flexural modulus in GPa'
  },
  linear_region_end: {
    type: Number,
    description: 'Deflection at end of linear region in mm'
  },
  publish_year: {
    type: Number,
    default: 2024
  }
}, {
  timestamps: true
});

// Index for faster queries
loadDeflectionDataSchema.index({ fiber_type: 1, matrix_type: 1, fiber_volume_fraction: 1 });

module.exports = mongoose.model('LoadDeflectionData', loadDeflectionDataSchema);
