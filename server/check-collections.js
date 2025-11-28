// check-collections.js
// Quick script to verify all collections in the database

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkCollections = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('📊 Connected to database:', mongoose.connection.name);
    console.log('=====================================\n');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('📁 Collections in database:');
    console.log('=====================================');
    
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`   ✓ ${collection.name.padEnd(20)} - ${count} document(s)`);
    }
    
    console.log('=====================================\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  }
};

checkCollections();
