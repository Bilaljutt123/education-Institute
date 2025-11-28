import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

console.log('Checking environment variables...');
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is missing');
} else {
  console.log('✅ MONGO_URI is present');
}

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is missing');
} else {
  console.log('✅ JWT_SECRET is present');
}

const testDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    const userCount = await User.countDocuments();
    console.log(`✅ Found ${userCount} users in the database`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Database Error:', error);
    process.exit(1);
  }
};

testDB();
