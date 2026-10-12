import mongoose, { Schema } from 'mongoose';

export const UserRole = ['admin', 'staff', 'viewer'] as const;
export type UserRoleType = (typeof UserRole)[number];

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: UserRole, default: 'staff' },
    department: { type: String, default: 'General' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const User =
  mongoose.models.User || mongoose.model('User', userSchema);
