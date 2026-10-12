import { Router } from 'express';
import { z } from 'zod';
import { Server } from 'socket.io';

import { Patient, PatientStatus } from '../models/Patient.js';
import { StatusChange } from '../models/StatusChange.js';
import { authorize, type AuthenticatedRequest } from '../middleware/auth.js';

const createPatientSchema = z.object({
  mrn: z.string().min(3),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  age: z.number().min(0),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  department: z.string().min(2),
  room: z.string().optional(),
  assignedStaff: z.string().optional(),
  currentStatus: z.enum(PatientStatus).optional(),
});

const updateStatusSchema = z.object({
  newStatus: z.enum(PatientStatus),
  reason: z.string().optional(),
});

const patientRouter = Router();

patientRouter.get(
  '/',
  authorize(['admin', 'staff', 'viewer']),
  async (_req, res) => {
    const patients = await Patient.find().sort({ createdAt: -1 }).lean();
    return res.json({ patients });
  },
);

patientRouter.get(
  '/dashboard-summary',
  authorize(['admin', 'staff', 'viewer']),
  async (_req, res) => {
    const summary = await Patient.aggregate([
      { $group: { _id: '$currentStatus', count: { $sum: 1 } } }
    ]);

    const totalPatients = await Patient.countDocuments();
    const totalCritical = await Patient.countDocuments({
      currentStatus: 'critical',
    });

    const grouped = Object.fromEntries(
      summary.map((item) => [item._id, item.count]),
    );

    return res.json({
      totalPatients,
      totalCritical,
      byStatus: grouped,
    });
  },
);

patientRouter.get(
  '/:id',
  authorize(['admin', 'staff', 'viewer']),
  async (req, res) => {
    const patient = await Patient.findById(req.params.id).lean();

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.json({ patient });
  },
);

patientRouter.post(
  '/',
  authorize(['admin', 'staff']),
  async (req, res, next) => {
    try {
      const parsed = createPatientSchema.parse(req.body);
      const patient = await Patient.create(parsed);

      return res.status(201).json({ patient });
    } catch (error) {
      next(error);
    }
  },
);

patientRouter.patch(
  '/:id',
  authorize(['admin', 'staff']),
  async (req, res, next) => {
    try {
      const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      return res.json({ patient });
    } catch (error) {
      next(error);
    }
  },
);

patientRouter.post(
  '/:id/status',
  authorize(['admin', 'staff']),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const parsed = updateStatusSchema.parse(req.body);
      const patient = await Patient.findById(req.params.id);

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      const previousStatus = patient.currentStatus;
      patient.currentStatus = parsed.newStatus;
      await patient.save();

      const statusChange = await StatusChange.create({
        patientId: patient._id,
        previousStatus,
        newStatus: parsed.newStatus,
        reason: parsed.reason || '',
        changedBy: req.user?.id,
        department: patient.department,
      });

      const io = req.app.get('io') as Server;

      io.to(`patient:${patient._id.toString()}`).emit('status:update', {
        patientId: patient._id.toString(),
        previousStatus,
        newStatus: parsed.newStatus,
        department: patient.department,
        reason: parsed.reason || '',
        timestamp: new Date().toISOString(),
      });

      io.to(`department:${patient.department}`).emit('department:update', {
        patientId: patient._id.toString(),
        previousStatus,
        newStatus: parsed.newStatus,
        department: patient.department,
        timestamp: new Date().toISOString(),
      });

      return res.status(200).json({
        patient,
        statusChange,
        message: 'Status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  },
);

patientRouter.get(
  '/:id/statuses',
  authorize(['admin', 'staff', 'viewer']),
  async (req, res) => {
    const history = await StatusChange.find({
      patientId: req.params.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ history });
  },
);

export { patientRouter };
