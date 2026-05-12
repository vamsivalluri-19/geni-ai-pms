import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@test.com' }).select('+password');
    if (admin) {
      console.log('Admin found:', {
        email: admin.email,
        role: admin.role,
        otpVerified: admin.otpVerified,
        hasPassword: !!admin.password
      });
    } else {
      console.log('Admin user NOT found');
    }

    const roles = await User.distinct('role');
    console.log('Existing roles:', roles);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkUser();
