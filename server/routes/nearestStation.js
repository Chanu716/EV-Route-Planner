import express from 'express';
const router = express.Router();

// Mock data for charging stations
const chargingStations = [
    { lat: 12.9716, lng: 77.5946, name: "Bangalore Central" },
    { lat: 13.0827, lng: 80.2707, name: "Chennai Central" },
    { lat: 17.3850, lng: 78.4867, name: "Hyderabad Central" },
    { lat: 19.0760, lng: 72.8777, name: "Mumbai Central" },
    { lat: 28.6139, lng: 77.2090, name: "Delhi Central" }
];

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

router.post('/find-nearest', (req, res) => {
    const { startLocation } = req.body;
    
    if (!startLocation || typeof startLocation.lat !== 'number' || typeof startLocation.lng !== 'number') {
        return res.status(400).json({ 
            success: false,
            error: 'Invalid start location',
            received: startLocation 
        });
    }

    try {
        let nearestStation = null;
        let shortestDistance = Infinity;

        chargingStations.forEach(station => {
            const distance = calculateDistance(
                startLocation.lat,
                startLocation.lng,
                station.lat,
                station.lng
            );

            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestStation = {
                    ...station,
                    distance_km: distance
                };
            }
        });

        if (!nearestStation) {
            return res.status(404).json({
                success: false,
                error: 'No charging stations found'
            });
        }

        // Create a direct path to the nearest station
        const path = [nearestStation];

        res.json({
            success: true,
            nearest_station: nearestStation,
            path: path
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ 
            success: false,
            error: 'Failed to find nearest charging station',
            details: err.message 
        });
    }
});

export default router;
