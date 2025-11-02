import express from 'express';
import ChargingStation from '../models/ChargingStation.js';

const router = express.Router();

// Get all charging stations
router.get('/', async (req, res) => {
    try {
        const stations = await ChargingStation.find();
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new charging station
router.post('/', async (req, res) => {
    try {
        const newStation = new ChargingStation(req.body);
        await newStation.save();
        res.status(201).json(newStation);
    } catch (error) {
        console.error('Error creating station:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get nearby charging stations
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, radius = 10000 } = req.query; // radius in meters

        const stations = await ChargingStation.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            }
        });

        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get charging station by ID
router.get('/:id', async (req, res) => {
    try {
        const station = await ChargingStation.findById(req.params.id);
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }
        res.json(station);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add rating to charging station
router.post('/:id/ratings', async (req, res) => {
    try {
        const { rating, comment, userId } = req.body;
        const station = await ChargingStation.findById(req.params.id);
        
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }

        station.ratings.push({
            user: userId,
            rating,
            comment
        });

        await station.save();
        res.json(station);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update charging station availability
router.patch('/:id/availability', async (req, res) => {
    try {
        const { availableSpots } = req.body;
        const station = await ChargingStation.findById(req.params.id);
        
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }

        station.availability.availableSpots = availableSpots;
        await station.save();
        res.json(station);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Filter stations by connector type
router.get('/filter/connectors', async (req, res) => {
    try {
        const { types } = req.query;
        const connectorTypes = types.split(',');

        const stations = await ChargingStation.find({
            connectorTypes: { $in: connectorTypes }
        });

        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
