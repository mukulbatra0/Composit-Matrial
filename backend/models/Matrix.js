const mongoose = require('mongoose');

const matrixSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  density: {
    type: Number,
    required: true,
    min: 0,
    description: 'Density in g/cm³'
  },
  tensile_strength: {
    type: Number,
    required: true,
    min: 0,
    description: 'Tensile strength in MPa'
  },
  elastic_modulus: {
    type: Number,
    required: true,
    min: 0,
    description: 'Elastic modulus in GPa'
  },
  max_strain_to_failure: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    description: 'Maximum strain to failure in %'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Matrix', matrixSchema);
