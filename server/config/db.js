// config/db.js

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Use IPv4, skip trying IPv6 which can cause DNS issues on mobile
    });

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
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`Hint: If using mobile data, try using a standard connection string (mongodb://) instead of SRV (mongodb+srv://)`);
    process.exit(1);
  }
};

export default connectDB;