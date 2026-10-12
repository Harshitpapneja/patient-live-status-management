import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { authRouter } from './routes/authRoutes.js';
import { patientRouter } from './routes/patientRoutes.js';
import { initializeSocket } from './socket/index.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'patient-live-status-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/patients', patientRouter);

app.use((err: any, _req: any, res: any, _next: any) => {
  logger.error({ err }, 'Unhandled error');
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
    ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

initializeSocket(io);

const startServer = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('MongoDB connected');

    server.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to connect to MongoDB');
    process.exit(1);
  }
};

startServer();

export { app, server };
