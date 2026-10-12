import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

export const initializeSocket = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        sub: string;
        email: string;
        role: 'admin' | 'staff' | 'viewer';
      };

      socket.data.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };

      return next();
    } catch (error) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('join-patient', (patientId: string) => {
      socket.join(`patient:${patientId}`);
    });

    socket.on('join-department', (department: string) => {
      socket.join(`department:${department}`);
    });

    socket.on('disconnect', () => {
      // cleanup
    });
  });
};
