// drop-department-indexes.js
// Run this script to remove unique indexes from departments collection

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dropIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const db = mongoose.connection.db;
    const collection = db.collection('departments');

    // Drop the name_1 index
    try {
      await collection.dropIndex('name_1');
      console.log('✅ Successfully dropped name_1 index');
    } catch (err) {
      if (err.code === 27) {
        console.log('ℹ️  name_1 index does not exist (already dropped or never created)');
      } else {
        console.error('Error dropping name_1 index:', err.message);
      }
    }

    // Drop the code_1 index
    try {
      await collection.dropIndex('code_1');
      console.log('✅ Successfully dropped code_1 index');
    } catch (err) {
      if (err.code === 27) {
        console.log('ℹ️  code_1 index does not exist (already dropped or never created)');
      } else {
        console.error('Error dropping code_1 index:', err.message);
      }
    }

    console.log('\n✅ All done! You can now create departments with duplicate names and codes.');
    
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
};

dropIndexes();
