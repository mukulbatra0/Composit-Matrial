const mongoose = require('mongoose');

const compositeDataSchema = new mongoose.Schema({
  publish_year: {
    type: Number,
    required: true
  },
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
  fiber_content: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    description: 'Fiber content in % (volume or weight)'
  },
  content_type: {
    type: String,
    enum: ['volume', 'weight'],
    default: 'volume',
    description: 'Whether fiber_content is volume % or weight %'
  },
  orientation: {
    type: String,
    default: '0',
    description: 'Fiber orientation (0, 45, 90, Random, UD, 0/90, etc.)'
  },
  tensile_strength: {
    type: Number,
    required: true,
    min: 0,
    description: 'Tensile strength in MPa'
  },
  youngs_modulus: {
    type: Number,
    min: 0,
    description: 'Young\'s modulus in GPa'
  },
  ply_count: {
    type: Number,
    min: 0,
    description: 'Number of plies (if applicable)'
  }
}, {
  timestamps: true
});

// Index for faster queries
compositeDataSchema.index({ fiber_type: 1, matrix_type: 1 });
compositeDataSchema.index({ fiber_content: 1 });

module.exports = mongoose.model('CompositeData', compositeDataSchema);
