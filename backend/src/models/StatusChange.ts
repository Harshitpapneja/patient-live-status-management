import mongoose, { Schema } from 'mongoose';

const statusChangeSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    previousStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    reason: { type: String, default: '' },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    department: { type: String, required: true },
  },
  { timestamps: true },
);

export const StatusChange =
  mongoose.models.StatusChange ||
  mongoose.model('StatusChange', statusChangeSchema);
