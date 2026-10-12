# Patient Live Status Management

Production-grade MERN project for patient live status management with realtime updates, workflow tracking, role-based access, and deployment-ready structure.

## Stack
- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Node + Express + TypeScript + Mongoose
- Database: MongoDB
- Realtime: Socket.io
- Auth: JWT + role-based access
- Deployment: Vercel + Render

## Features
- Live patient status updates
- Staff/admin/viewer roles
- Status history and audit trail
- Real-time operations dashboard
- MongoDB-backed patient model
- Docker local setup
- CI workflow

## Local setup
```bash
npm install
npm --workspace backend install
npm --workspace frontend install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start local services
cd infra && docker compose up -d

# Seed demo data
npm --workspace backend run seed

# Run app
npm run dev:backend
npm run dev:frontend
```

## Demo login
- admin@livecare.local / password123
- staff@livecare.local / password123
- viewer@livecare.local / password123

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Redis: use Upstash/Render Redis for realtime scaling

## Notes
This repo is scaffolded as a production-oriented healthcare operations dashboard and can be extended with more enterprise-grade features such as SSO, FHIR compatibility, and advanced analytics.
