import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { setupDomainListeners } from './observers/Listeners';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // In production, allow same-origin and specific frontend URL
    if (!origin || 
        origin.includes('localhost') || 
        origin.includes('vercel.app') || 
        origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Initialize Domain Listeners
setupDomainListeners();

// Main Routes
app.use('/api', routes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'TrustLayer API is running' });
});

// Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 TrustLayer Backend running on port ${PORT}`);
  });
}

export default app;
