// config/db.js

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Drop the unique index on email field to allow multiple applications per student
    try {
      await conn.connection.db.collection('applications').dropIndex('email_1');
      console.log('✅ Dropped email unique index from applications collection');
    } catch (indexError) {
      // Index might not exist, which is fine
      if (indexError.code === 27 || indexError.codeName === 'IndexNotFound') {
        console.log('ℹ️  Email index does not exist (already dropped or never created)');
      } else {
        console.log('ℹ️  Could not drop email index:', indexError.message);
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;