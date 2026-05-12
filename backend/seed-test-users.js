import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import Student from './models/Student.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const roles = ['admin', 'hr', 'staff', 'student', 'recruiter', 'student_test'];
    const password = 'Password123!';

    for (const role of roles) {
      const email = `${role}@test.com`;
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
          email,
          password,
          role: role.includes('student') ? 'student' : role,
          department: !role.includes('student') ? 'IT' : '',
          studentRollNumber: role.includes('student') ? `STU${role.toUpperCase().slice(7, 10) || '001'}` : '',
          employeeId: !role.includes('student') ? `EMP${role.toUpperCase().slice(0, 3)}` : '',
          otpVerified: true,
          termsAcceptedAt: new Date()
        });
        console.log(`Created ${role} user: ${email}`);
      } else {
        console.log(`${role} user already exists: ${email}`);
      }

      // If the role is student, ensure a Student profile document exists
      if (role.includes('student')) {
        const studentProfile = await Student.findOne({ user: user._id });
        if (!studentProfile) {
          await Student.create({
            user: user._id,
            rollNumber: user.studentRollNumber || `STU${Math.floor(Math.random() * 1000)}`,
            branch: 'CSE',
            cgpa: 8.5,
            semester: '8th',
            section: 'A',
            phoneNumber: '1234567890',
            skills: ['React', 'Node.js', 'MongoDB', 'Express']
          });
          console.log(`Created Student profile for: ${email}`);
        }
      }
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
