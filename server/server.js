import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
import authRoutes from './routes/auth.js';
import chargingStationsRoutes from './routes/chargingStations.js';
import routeHistoryRoutes from './routes/routeHistory.js';
import userPreferencesRoutes from './routes/userPreferences.js';
import predictionRoutes from './routes/predictions.js';
import optimizedRoutesRoutes from './routes/optimizedRoutes.js';
import nearestStationRoutes from './routes/nearestStation.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', chargingStationsRoutes);
app.use('/api/routes', routeHistoryRoutes);
app.use('/api/preferences', userPreferencesRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/optimized-routes', optimizedRoutesRoutes);
app.use('/api/nearest-station', nearestStationRoutes);

// Basic route for testing
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
