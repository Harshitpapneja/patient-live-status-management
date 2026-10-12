import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Patient } from '../models/Patient.js';

const runSeed = async () => {
  await mongoose.connect(env.MONGODB_URI);

  const users = [
    {
      name: 'Alice Admin',
      email: 'admin@livecare.local',
      password: 'password123',
      role: 'admin',
      department: 'Operations',
    },
    {
      name: 'Bob Staff',
      email: 'staff@livecare.local',
      password: 'password123',
      role: 'staff',
      department: 'Emergency',
    },
    {
      name: 'Charlie Viewer',
      email: 'viewer@livecare.local',
      password: 'password123',
      role: 'viewer',
      department: 'Monitoring',
    },
  ];

  for (const user of users) {
    const existing = await User.findOne({ email: user.email });
    if (!existing) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await User.create({
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        department: user.department,
      });
    }
  }

  const patients = [
    {
      mrn: 'MRN-1001',
      firstName: 'Ava',
      lastName: 'Patel',
      age: 32,
      gender: 'Female',
      department: 'Emergency',
      room: 'ER-12',
      currentStatus: 'critical',
    },
    {
      mrn: 'MRN-1002',
      firstName: 'Lucas',
      lastName: 'Brown',
      age: 48,
      gender: 'Male',
      department: 'General',
      room: 'Ward-A1',
      currentStatus: 'in-consultation',
    },
    {
      mrn: 'MRN-1003',
      firstName: 'Sofia',
      lastName: 'Nguyen',
      age: 27,
      gender: 'Female',
      department: 'General',
      room: 'Reception',
      currentStatus: 'waiting',
    },
    {
      mrn: 'MRN-1004',
      firstName: 'Daniel',
      lastName: 'Kim',
      age: 56,
      gender: 'Male',
      department: 'ICU',
      room: 'ICU-3',
      currentStatus: 'observation',
    },
  ];

  for (const patient of patients) {
    const existing = await Patient.findOne({ mrn: patient.mrn });
    if (!existing) {
      await Patient.create(patient);
    }
  }

  console.log('Seed completed');
  process.exit(0);
};

runSeed().catch((error) => {
  console.error(error);
  process.exit(1);
});
