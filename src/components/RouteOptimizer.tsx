import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { GoogleMap, DirectionsRenderer, Marker, Polyline } from '@react-google-maps/api';
import { CarModel } from '../data/carModels';

interface Location {
  lat: number;
  lng: number;
}

interface ChargingStation {
  lat: number;
  lng: number;
  name: string;
  distance_km?: number;
}

interface RouteOptimizerProps {
  selectedCar: CarModel;
  currentLocation: Location;
}

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ selectedCar, currentLocation }) => {
  const [route, setRoute] = useState<google.maps.DirectionsResult | null>(null);
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [nearestStationPath, setNearestStationPath] = useState<ChargingStation[]>([]);
  const [startLocation, setStartLocation] = useState<Location>(currentLocation);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [directDistance, setDirectDistance] = useState<number | null>(null);
  const [totalDistance, setTotalDistance] = useState<number | null>(null);

  const calculateDistance = (start: Location, end: Location) => {
    const R = 6371; // Earth's radius in km
    const dLat = (end.lat - start.lat) * Math.PI / 180;
    const dLon = (end.lng - start.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(start.lat * Math.PI / 180) * Math.cos(end.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const findOptimalRoute = useCallback(async () => {
    if (!endLocation) {
      setError('Please enter an end destination');
      return;
    }

    setLoading(true);
    setError(null);

    // Calculate direct distance between start and end points
    const distance = calculateDistance(startLocation, endLocation);
    setDirectDistance(distance);

    try {
      const response = await axios.post('/api/optimized-routes/find', {
        startLocation: startLocation,
        endLocation: endLocation,
        carModel: selectedCar,
        currentBatteryLevel: batteryLevel
      });

      if (response.data.success) {
        setStations(response.data.stations || []);
        
        if (response.data.stations && response.data.stations.length > 0) {
          const directionsService = new google.maps.DirectionsService();
          const waypoints = response.data.stations.map((station: any) => ({
            location: new google.maps.LatLng(station.lat, station.lng),
            stopover: true
          }));

          const result = await directionsService.route({
            origin: new google.maps.LatLng(startLocation.lat, startLocation.lng),
            destination: new google.maps.LatLng(
              response.data.stations[response.data.stations.length - 1].lat,
              response.data.stations[response.data.stations.length - 1].lng
            ),
            waypoints: waypoints.slice(0, -1),
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING
          });

          // Calculate total distance from the route
          const totalDistanceInMeters = result.routes[0].legs.reduce(
            (total, leg) => total + (leg.distance?.value || 0),
            0
          );
          setTotalDistance(totalDistanceInMeters / 1000); // Convert to kilometers
          setRoute(result);
        }
      }
    } catch (err) {
      setError('Failed to find optimal route. Please try again.');
      console.error('Route optimization error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentLocation, selectedCar, batteryLevel, startLocation, endLocation]);

  const findNearestChargingPoint = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/nearest-station/find-nearest', {
        startLocation: currentLocation
      });

      if (response.data.success && response.data.nearest_station) {
        const station = response.data.nearest_station;
        setStations([station]);
        setNearestStationPath(response.data.path || []);
        setRoute(null);
      } else {
        throw new Error('No nearest station found');
      }
    } catch (err) {
      setError('Failed to find nearest charging station. Please try again.');
      console.error('Nearest station error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentLocation]);

  return (
    <div className="route-optimizer p-4">
      <div className="controls mb-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Location
            </label>
            <input
              type="text"
              placeholder="Enter latitude"
              value={startLocation.lat}
              onChange={(e) => setStartLocation(prev => ({ ...prev, lat: Number(e.target.value) }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Enter longitude"
              value={startLocation.lng}
              onChange={(e) => setStartLocation(prev => ({ ...prev, lng: Number(e.target.value) }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md mt-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Location
            </label>
            <input
              type="text"
              placeholder="Enter latitude"
              value={endLocation?.lat || ''}
              onChange={(e) => setEndLocation(prev => ({
                lat: Number(e.target.value),
                lng: prev?.lng || 0
              }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Enter longitude"
              value={endLocation?.lng || ''}
              onChange={(e) => setEndLocation(prev => ({
                lat: prev?.lat || 0,
                lng: Number(e.target.value)
              }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md mt-2"
            />
          </div>
        </div>

        <div className="battery-control">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Battery Level (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={batteryLevel}
            onChange={(e) => setBatteryLevel(Number(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          onClick={findOptimalRoute}
          disabled={loading || !endLocation}
          className={`w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm ${
            loading || !endLocation ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Finding Route...' : 'Find Optimal Route'}
        </button>

        {/* Direct Distance Display */}
        {directDistance !== null && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="text-center">
              <span className="font-medium">Direct Distance: </span>
              <span className="text-blue-600 font-bold">{directDistance.toFixed(1)} km</span>
            </div>
          </div>
        )}

        <button
          onClick={findNearestChargingPoint}
          disabled={loading}
          className={`w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Finding Station...' : 'Nearest Charging Point'}
        </button>
        {error && (
          <div className="error text-red-600 text-sm">{error}</div>
        )}
      </div>

      <div className="map-container h-[500px] rounded-lg overflow-hidden">
        <GoogleMap
          zoom={12}
          center={startLocation}
          mapContainerClassName="w-full h-full"
        >
          {/* Current Location Marker */}
          <Marker
            position={startLocation}
            icon={{
              url: '/car-icon.png',
              scaledSize: new google.maps.Size(32, 32)
            }}
          />

          {/* Charging Station Markers */}
          {stations.map((station, index) => (
            <Marker
              key={index}
              position={{ lat: station.lat, lng: station.lng }}
              icon={{
                url: '/charging-station-icon.png',
                scaledSize: new google.maps.Size(32, 32)
              }}
            />
          ))}

          {/* Route Display */}
          {route && <DirectionsRenderer directions={route} />}

          {/* Nearest Station Path */}
          {nearestStationPath.length > 0 && (
            <Polyline
              path={[
                startLocation,
                ...nearestStationPath.map(point => ({ lat: point.lat, lng: point.lng }))
              ]}
              options={{
                strokeColor: '#0000FF',
                strokeOpacity: 1.0,
                strokeWeight: 3
              }}
            />
          )}
        </GoogleMap>
      </div>

      {/* Total Distance Display */}
      {totalDistance !== null && route && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-900">Total Route Distance:</h3>
            <div className="text-2xl font-bold text-blue-600">{totalDistance.toFixed(1)} km</div>
          </div>
        </div>
      )}

      {stations.length > 0 && (
        <div className="route-info mt-4">
          <h3 className="text-lg font-semibold mb-2">Charging Stations:</h3>
          <div className="space-y-2">
            {stations.map((station, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-md shadow-sm border border-gray-200"
              >
                <div className="font-medium">{station.name}</div>
                {station.distance_km !== undefined && (
                  <div className="text-sm text-gray-600">
                    Distance: {station.distance_km.toFixed(1)} km
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteOptimizer;
