import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import ChargingStation from '../models/ChargingStation.js';

const router = express.Router();

// Find optimal route with charging stations
router.post('/find', async (req, res) => {
    try {
        const {
            startLocation,
            endLocation,
            carModel,
            currentBatteryLevel,
            trafficLevel
        } = req.body;

        // Get all charging stations from database
        const stations = await ChargingStation.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [startLocation.lng, startLocation.lat]
                    },
                    $maxDistance: carModel.baseRange * 1000 // Convert km to meters
                }
            }
        });

        // Call Python optimization script
        const pythonProcess = spawn('python', [
            path.join(process.cwd(), 'server/ml/route_optimizer.py'),
            JSON.stringify({
                start_location: [startLocation.lat, startLocation.lng],
                end_location: [endLocation.lat, endLocation.lng],
                car_range: carModel.baseRange * (currentBatteryLevel / 100),
                stations: stations.map(station => ({
                    id: station._id,
                    location: {
                        lat: station.location.coordinates[1],
                        lng: station.location.coordinates[0]
                    },
                    name: station.name,
                    amenities: station.amenities,
                    current_load: station.currentLoad,
                    temperature: station.temperature,
                    humidity: station.humidity
                })),
                traffic_level: trafficLevel || 50
            })
        ]);

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error from optimization script: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: 'Route optimization failed' });
            }
            const optimizedRoute = JSON.parse(result);
            res.json({
                success: true,
                route: optimizedRoute
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
