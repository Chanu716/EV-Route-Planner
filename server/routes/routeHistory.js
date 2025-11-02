import express from 'express';
import RouteHistory from '../models/RouteHistory.js';

const router = express.Router();

// Get user's route history
router.get('/user/:userId', async (req, res) => {
    try {
        const routes = await RouteHistory.find({ user: req.params.userId })
            .populate('chargingStops.station')
            .sort({ createdAt: -1 });
        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new route
router.post('/', async (req, res) => {
    try {
        const newRoute = new RouteHistory(req.body);
        await newRoute.save();
        res.status(201).json(newRoute);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update route status
router.patch('/:id/status', async (req, res) => {
    try {
        const { completed, endTime } = req.body;
        const route = await RouteHistory.findById(req.params.id);
        
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        route.completed = completed;
        if (completed) {
            route.endTime = endTime || new Date();
        }

        await route.save();
        res.json(route);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get route statistics
router.get('/stats/:userId', async (req, res) => {
    try {
        const stats = await RouteHistory.aggregate([
            { $match: { user: req.params.userId } },
            {
                $group: {
                    _id: null,
                    totalRoutes: { $sum: 1 },
                    totalDistance: { $sum: '$distance.value' },
                    averageDuration: { $avg: '$duration.value' },
                    totalChargingStops: { $sum: { $size: '$chargingStops' } }
                }
            }
        ]);

        res.json(stats[0] || {
            totalRoutes: 0,
            totalDistance: 0,
            averageDuration: 0,
            totalChargingStops: 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
