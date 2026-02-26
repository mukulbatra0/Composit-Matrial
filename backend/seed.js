const mongoose = require('mongoose');
require('dotenv').config();
const Fiber = require('./models/Fiber');
const Matrix = require('./models/Matrix');

const fibers = [
  {
    name: 'Carbon Fiber',
    density: 1.8,
    tensile_strength: 4000,
    elastic_modulus: 230,
    max_strain_to_failure: 1.7
  },
  {
    name: 'E-Glass Fiber',
    density: 2.54,
    tensile_strength: 3445,
    elastic_modulus: 72.5,
    max_strain_to_failure: 4.8
  },
  {
    name: 'Kevlar 49',
    density: 1.44,
    tensile_strength: 3620,
    elastic_modulus: 131,
    max_strain_to_failure: 2.8
  },
  {
    name: 'S-Glass Fiber',
    density: 2.49,
    tensile_strength: 4710,
    elastic_modulus: 86.9,
    max_strain_to_failure: 5.4
  }
];

const matrices = [
  {
    name: 'Epoxy Resin',
    density: 1.2,
    tensile_strength: 75,
    elastic_modulus: 3.5,
    max_strain_to_failure: 5.0
  },
  {
    name: 'Polyester Resin',
    density: 1.1,
    tensile_strength: 55,
    elastic_modulus: 2.8,
    max_strain_to_failure: 2.5
  },
  {
    name: 'Aluminum Matrix',
    density: 2.7,
    tensile_strength: 310,
    elastic_modulus: 69,
    max_strain_to_failure: 12.0
  },
  {
    name: 'Vinyl Ester',
    density: 1.15,
    tensile_strength: 82,
    elastic_modulus: 3.3,
    max_strain_to_failure: 4.5
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Fiber.deleteMany({});
    await Matrix.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    await Fiber.insertMany(fibers);
    await Matrix.insertMany(matrices);
    console.log('Database seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
