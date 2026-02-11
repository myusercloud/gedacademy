require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

const SALT_ROUNDS = 10;

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    const name = process.env.ADMIN_NAME || 'Super Admin';
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'ChangeThisAdminPassword123';

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: 'admin',
    });

    console.log('Admin user created successfully:');
    console.log('Email:', admin.email);
    console.log('Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin user', err);
    process.exit(1);
  }
};

seedAdmin();

