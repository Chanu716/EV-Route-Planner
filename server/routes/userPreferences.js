import express from 'express';
import UserPreferences from '../models/UserPreferences.js';

const router = express.Router();

// Get user preferences
router.get('/:userId', async (req, res) => {
    try {
        let preferences = await UserPreferences.findOne({ user: req.params.userId })
            .populate('favoriteStations');

        if (!preferences) {
            preferences = new UserPreferences({ user: req.params.userId });
            await preferences.save();
        }

        res.json(preferences);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user preferences
router.put('/:userId', async (req, res) => {
    try {
        const preferences = await UserPreferences.findOneAndUpdate(
            { user: req.params.userId },
            req.body,
            { new: true, upsert: true }
        ).populate('favoriteStations');

        res.json(preferences);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add favorite station
router.post('/:userId/favorites', async (req, res) => {
    try {
        const { stationId } = req.body;
        const preferences = await UserPreferences.findOne({ user: req.params.userId });

        if (!preferences) {
            return res.status(404).json({ message: 'Preferences not found' });
        }

        if (!preferences.favoriteStations.includes(stationId)) {
            preferences.favoriteStations.push(stationId);
            await preferences.save();
        }

        res.json(preferences);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove favorite station
router.delete('/:userId/favorites/:stationId', async (req, res) => {
    try {
        const preferences = await UserPreferences.findOne({ user: req.params.userId });

        if (!preferences) {
            return res.status(404).json({ message: 'Preferences not found' });
        }

        preferences.favoriteStations = preferences.favoriteStations.filter(
            station => station.toString() !== req.params.stationId
        );

        await preferences.save();
        res.json(preferences);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update display preferences
router.patch('/:userId/display', async (req, res) => {
    try {
        const preferences = await UserPreferences.findOneAndUpdate(
            { user: req.params.userId },
            { $set: { displayPreferences: req.body } },
            { new: true }
        );

        if (!preferences) {
            return res.status(404).json({ message: 'Preferences not found' });
        }

        res.json(preferences);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
