import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import checklistRoutes from './routes/checklistRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow any localhost origin in dev, or the configured CLIENT_URL in prod
    const allowed = process.env.NODE_ENV === 'production'
      ? [process.env.CLIENT_URL]
      : [process.env.CLIENT_URL, /^http:\/\/localhost:\d+$/];
    const isAllowed = !origin || allowed.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    callback(isAllowed ? null : new Error('Not allowed by CORS'), isAllowed);
  },
  credentials: true,
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1/trips/:tripId', itineraryRoutes);
app.use('/api/v1/trips/:tripId', budgetRoutes);
app.use('/api/v1/trips/:tripId/checklist', checklistRoutes);
app.use('/api/v1/trips/:tripId/notes', noteRoutes);
app.use('/api/v1/cities', cityRoutes);
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health check
app.get('/api/v1/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    errors: err.errors || [],
  });
});

// Start
const start = async () => {
  await initDB();
  const server = app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
  process.on('SIGTERM', () => { server.close(() => { console.log('Server closed'); process.exit(0); }); });
};

start();
