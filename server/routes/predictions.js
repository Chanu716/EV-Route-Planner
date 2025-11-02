import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import StationUsage from '../models/StationUsage.js';

const router = express.Router();

// Get prediction for station availability
router.post('/availability', async (req, res) => {
    try {
        const {
            station_id,
            timestamp,
            traffic_level,
            temperature,
            humidity,
            battery_level
        } = req.body;

        // Save the actual data for retraining
        const usage = new StationUsage({
            station_id,
            timestamp,
            traffic_level,
            temperature,
            humidity,
            battery_level
        });
        await usage.save();

        // Call Python prediction script
        const pythonProcess = spawn('python', [
            path.join(process.cwd(), 'server/ml/predict.py'),
            JSON.stringify({
                hour_of_day: new Date(timestamp).getHours(),
                day_of_week: new Date(timestamp).getDay(),
                traffic_level,
                temperature,
                humidity,
                battery_level
            })
        ]);

        let prediction = '';
        pythonProcess.stdout.on('data', (data) => {
            prediction += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error from prediction script: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: 'Prediction failed' });
            }
            res.json(JSON.parse(prediction));
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Trigger model retraining
router.post('/retrain', async (req, res) => {
    try {
        const pythonProcess = spawn('python', [
            path.join(process.cwd(), 'server/ml/train_model.py')
        ]);

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error from training script: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: 'Training failed' });
            }
            res.json(JSON.parse(result));
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get model metrics
router.get('/metrics', (req, res) => {
    try {
        const metricsPath = path.join(process.cwd(), 'server/ml/models/training_results.json');
        const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
