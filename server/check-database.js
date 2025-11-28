// check-database.js
// This script shows which database your data is being saved to

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Department from './models/Department.js';

dotenv.config();

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('\n📊 DATABASE CONNECTION INFO:');
    console.log('=====================================');
    console.log('Connected to:', mongoose.connection.host);
    console.log('Database name:', mongoose.connection.name);
    console.log('Connection URI:', process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//<username>:<password>@'));
    console.log('=====================================\n');

    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections in this database:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    // Count documents
    console.log('\n📈 Document counts:');
    const userCount = await User.countDocuments();
    const deptCount = await Department.countDocuments();
    
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Departments: ${deptCount}`);

    // Show admin users
    console.log('\n👤 Admin users:');
    const admins = await User.find({ role: 'admin' }).select('name email');
    admins.forEach(admin => {
      console.log(`   - ${admin.name} (${admin.email})`);
    });

    // Show departments
    console.log('\n🏛️  Departments:');
    const depts = await Department.find();
    depts.forEach(dept => {
      console.log(`   - ${dept.name} (${dept.code})`);
    });

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

checkDatabase();
