import mongoose, { Schema } from 'mongoose';

export const PatientStatus = [
  'waiting',
  'in-consultation',
  'observation',
  'ready-for-discharge',
  'discharged',
  'critical',
] as const;

export type PatientStatusType = (typeof PatientStatus)[number];

const patientSchema = new Schema(
  {
    mrn: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Other',
    },
    department: { type: String, required: true },
    room: { type: String, default: 'TBD' },
    assignedStaff: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    currentStatus: {
      type: String,
      enum: PatientStatus,
      default: 'waiting',
    },
    isAdmitted: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Patient =
  mongoose.models.Patient || mongoose.model('Patient', patientSchema);
