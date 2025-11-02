import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib
from datetime import datetime
import pandas as pd
from typing import List, Dict, Tuple
import math

class EVRouteOptimizer:
    def __init__(self):
        self.availability_model = None
        self.scaler = StandardScaler()
        
    def load_models(self, model_dir='models'):
        """Load the trained availability prediction model"""
        self.availability_model = joblib.load(f'{model_dir}/model.joblib')
        self.scaler = joblib.load(f'{model_dir}/scaler.joblib')
    
    def calculate_distance(self, point1: Tuple[float, float], point2: Tuple[float, float]) -> float:
        """Calculate distance between two points using Haversine formula"""
        lat1, lon1 = point1
        lat2, lon2 = point2
        R = 6371  # Earth's radius in km

        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat/2) * math.sin(dlat/2) +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dlon/2) * math.sin(dlon/2))
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c
    
    def predict_availability(self, station: Dict, current_time: datetime, traffic_level: float) -> float:
        """Predict the probability of station availability"""
        features = {
            'hour_of_day': current_time.hour,
            'day_of_week': current_time.weekday(),
            'traffic_level': traffic_level,
            'temperature': station.get('temperature', 25),  # Default values if not provided
            'humidity': station.get('humidity', 60),
            'battery_level': station.get('current_load', 50)
        }
        
        X = pd.DataFrame([features])
        X_scaled = self.scaler.transform(X)
        return self.availability_model.predict_proba(X_scaled)[0][1]
    
    def calculate_station_score(self, 
                              station: Dict,
                              current_location: Tuple[float, float],
                              destination: Tuple[float, float],
                              current_time: datetime,
                              traffic_level: float,
                              battery_range: float) -> float:
        """Calculate a score for each station based on multiple factors"""
        
        # Calculate distances
        distance_to_station = self.calculate_distance(current_location, (station['location']['lat'], station['location']['lng']))
        station_to_dest = self.calculate_distance((station['location']['lat'], station['location']['lng']), destination)
        
        # Predict availability
        availability_prob = self.predict_availability(station, current_time, traffic_level)
        
        # Calculate scores for each factor (0-1 scale)
        distance_score = 1 - (distance_to_station / battery_range)  # Higher score for closer stations
        route_deviation_score = 1 - (abs(distance_to_station + station_to_dest - self.calculate_distance(current_location, destination)) / battery_range)
        availability_score = availability_prob
        amenities_score = len(station.get('amenities', [])) / 10  # Normalize by max possible amenities
        
        # Weights for different factors
        weights = {
            'distance': 0.3,
            'route_deviation': 0.2,
            'availability': 0.3,
            'amenities': 0.2
        }
        
        # Calculate final score
        final_score = (
            weights['distance'] * distance_score +
            weights['route_deviation'] * route_deviation_score +
            weights['availability'] * availability_score +
            weights['amenities'] * amenities_score
        )
        
        return final_score
    
    def find_optimal_route(self,
                          start_location: Tuple[float, float],
                          end_location: Tuple[float, float],
                          car_range: float,
                          stations: List[Dict],
                          current_time: datetime = None,
                          traffic_level: float = None) -> List[Dict]:
        """Find the optimal route with charging stations"""
        if current_time is None:
            current_time = datetime.now()
        if traffic_level is None:
            traffic_level = 50  # Default medium traffic
            
        current_location = start_location
        route_stations = []
        remaining_range = car_range
        total_distance = self.calculate_distance(start_location, end_location)
        
        while remaining_range < total_distance:
            # Calculate scores for all stations within range
            station_scores = []
            for station in stations:
                distance = self.calculate_distance(current_location, (station['location']['lat'], station['location']['lng']))
                if distance <= remaining_range:
                    score = self.calculate_station_score(
                        station,
                        current_location,
                        end_location,
                        current_time,
                        traffic_level,
                        car_range
                    )
                    station_scores.append((station, score))
            
            if not station_scores:
                break
                
            # Select best station
            best_station = max(station_scores, key=lambda x: x[1])[0]
            route_stations.append(best_station)
            
            # Update current location and remaining range
            current_location = (best_station['location']['lat'], best_station['location']['lng'])
            distance_to_station = self.calculate_distance(current_location, (best_station['location']['lat'], best_station['location']['lng']))
            remaining_range = car_range  # Assume full charge at station
            total_distance = self.calculate_distance(current_location, end_location)
        
        return route_stations

if __name__ == "__main__":
    optimizer = EVRouteOptimizer()
    optimizer.load_models()
