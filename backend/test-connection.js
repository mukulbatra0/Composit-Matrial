const mongoose = require('mongoose');
require('dotenv').config();
const CompositeData = require('./models/CompositeData');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected successfully\n');

    // Count documents
    const count = await CompositeData.countDocuments();
    console.log(`✓ Found ${count} composite data documents\n`);

    if (count === 0) {
      console.log('⚠ WARNING: No data found! Run: npm run seed-experimental\n');
    } else {
      // Get unique fiber types
      const fiberTypes = await CompositeData.distinct('fiber_type');
      console.log('✓ Fiber Types:', fiberTypes.length);
      console.log('  ', fiberTypes.slice(0, 5).join(', '), '...\n');

      // Get unique matrix types
      const matrixTypes = await CompositeData.distinct('matrix_type');
      console.log('✓ Matrix Types:', matrixTypes.length);
      console.log('  ', matrixTypes.slice(0, 5).join(', '), '...\n');

      // Get unique orientations
      const orientations = await CompositeData.distinct('orientation');
      console.log('✓ Orientations:', orientations.length);
      console.log('  ', orientations.slice(0, 5).join(', '), '...\n');

      // Sample data
      const sample = await CompositeData.findOne();
      console.log('✓ Sample Data:');
      console.log('  ', JSON.stringify(sample, null, 2));
    }

    mongoose.connection.close();
    console.log('\n✓ Test completed successfully!');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
