import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    const email = 'admin@institute.com';
    const user = await User.findOne({ email }).select('+password');

    if (user) {
      console.log(`✅ User found: ${user.email}`);
      console.log(`Role: ${user.role}`);
      // We can't easily check the password hash without the plain text, 
      // but we can reset it if needed.
    } else {
      console.log(`❌ User ${email} not found. Creating default admin...`);
      
      const newUser = new User({
        name: 'Admin User',
        email: email,
        password: 'password123',
        role: 'admin'
      });

      await newUser.save();
      console.log('✅ Default admin created: admin@institute.com / password123');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkUser();
