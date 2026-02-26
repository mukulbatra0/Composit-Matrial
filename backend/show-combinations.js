const mongoose = require('mongoose');
require('dotenv').config();
const CompositeData = require('./models/CompositeData');

async function showCombinations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get all unique combinations
    const data = await CompositeData.find().limit(20);
    
    console.log('First 20 combinations in database:\n');
    console.log('Fiber Type | Matrix Type | Orientation | Count');
    console.log('-----------|-------------|-------------|------');
    
    const combinations = {};
    const allData = await CompositeData.find();
    
    allData.forEach(d => {
      const key = `${d.fiber_type}|${d.matrix_type}|${d.orientation}`;
      combinations[key] = (combinations[key] || 0) + 1;
    });
    
    Object.entries(combinations).slice(0, 20).forEach(([key, count]) => {
      const [fiber, matrix, orient] = key.split('|');
      console.log(`${fiber.padEnd(10)} | ${matrix.padEnd(11)} | ${orient.padEnd(11)} | ${count}`);
    });
    
    console.log('\n\nSample documents:');
    data.slice(0, 3).forEach((d, i) => {
      console.log(`\n${i + 1}. ${d.fiber_type} + ${d.matrix_type} + ${d.orientation}`);
      console.log(`   Fiber Content: ${d.fiber_content}%`);
      console.log(`   Tensile Strength: ${d.tensile_strength} MPa`);
      console.log(`   Young's Modulus: ${d.youngs_modulus} GPa`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

showCombinations();
