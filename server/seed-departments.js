// seed-departments.js
// This script creates initial departments in the database

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/Department.js';

dotenv.config();

const departments = [
  {
    name: 'Computer Science',
    code: 'CS',
    description: 'Department of Computer Science offering courses in programming, algorithms, data structures, and software engineering.',
    head: 'Dr. John Smith'
  },
  {
    name: 'Mathematics',
    code: 'MATH',
    description: 'Department of Mathematics covering algebra, calculus, statistics, and applied mathematics.',
    head: 'Dr. Sarah Johnson'
  },
  {
    name: 'Physics',
    code: 'PHY',
    description: 'Department of Physics exploring classical mechanics, quantum physics, thermodynamics, and electromagnetism.',
    head: 'Dr. Michael Brown'
  },
  {
    name: 'Chemistry',
    code: 'CHEM',
    description: 'Department of Chemistry focusing on organic, inorganic, physical, and analytical chemistry.',
    head: 'Dr. Emily Davis'
  },
  {
    name: 'English Literature',
    code: 'ENG',
    description: 'Department of English Literature studying classic and contemporary literature, creative writing, and literary analysis.',
    head: 'Dr. Robert Wilson'
  },
  {
    name: 'Business Administration',
    code: 'BUS',
    description: 'Department of Business Administration covering management, marketing, finance, and entrepreneurship.',
    head: 'Dr. Jennifer Martinez'
  }
];

const seedDepartments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('📊 Connected to database:', mongoose.connection.name);
    console.log('=====================================\n');

    // Check if departments already exist
    const existingCount = await Department.countDocuments();
    
    if (existingCount > 0) {
      console.log(`⚠️  Database already has ${existingCount} department(s).`);
      console.log('Do you want to:');
      console.log('1. Keep existing departments and add new ones');
      console.log('2. Delete all and recreate');
      console.log('\nTo delete all departments, run: node delete-all-departments.js');
      console.log('To continue adding, the script will skip duplicates.\n');
    }

    // Insert departments (skip duplicates)
    let added = 0;
    let skipped = 0;

    for (const dept of departments) {
      const existing = await Department.findOne({ code: dept.code });
      
      if (existing) {
        console.log(`⏭️  Skipped: ${dept.name} (${dept.code}) - already exists`);
        skipped++;
      } else {
        await Department.create(dept);
        console.log(`✅ Created: ${dept.name} (${dept.code})`);
        added++;
      }
    }

    console.log('\n=====================================');
    console.log(`📈 Summary:`);
    console.log(`   - Added: ${added} department(s)`);
    console.log(`   - Skipped: ${skipped} department(s)`);
    console.log(`   - Total in database: ${await Department.countDocuments()}`);
    console.log('=====================================\n');

    // List all departments
    console.log('🏛️  All Departments in Database:');
    const allDepts = await Department.find().sort({ code: 1 });
    allDepts.forEach(dept => {
      console.log(`   - ${dept.name} (${dept.code})`);
      console.log(`     Head: ${dept.head || 'Not assigned'}`);
      console.log(`     Description: ${dept.description.substring(0, 60)}...`);
      console.log('');
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  }
};

seedDepartments();
