// Core backend service and Socket integration are scaffolded here.
// This project is organized for production-style extension and can be expanded with real API and socket modules.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
