import sys
import json
import math
from typing import Dict, List, Set, Tuple
from heapq import heappush, heappop

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the distance between two points on Earth using the Haversine formula."""
    R = 6371  # Earth's radius in kilometers

    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad

    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c

def dijkstra(start_location: Dict[str, float], charging_stations: List[Dict[str, float]]) -> Tuple[Dict[str, float], List[Dict[str, float]]]:
    """Find the nearest charging station using Dijkstra's algorithm."""
    distances = {}
    visited = set()
    previous = {}
    pq = []  # Priority queue

    # Initialize distances
    for i, station in enumerate(charging_stations):
        station_id = str(i)
        distances[station_id] = float('inf')
        previous[station_id] = None

    # Add start location to priority queue
    heappush(pq, (0, 'start'))
    distances['start'] = 0

    while pq:
        current_distance, current_vertex = heappop(pq)

        if current_vertex in visited:
            continue

        visited.add(current_vertex)

        # If we're at a charging station, we've found our nearest station
        if current_vertex != 'start':
            path = []
            current = current_vertex
            while current is not None:
                if current != 'start':
                    path.append(charging_stations[int(current)])
                current = previous[current]
            return charging_stations[int(current_vertex)], list(reversed(path))

        # Calculate distances to all unvisited charging stations
        for i, station in enumerate(charging_stations):
            vertex = str(i)
            if vertex not in visited:
                if current_vertex == 'start':
                    distance = haversine_distance(
                        start_location['lat'], 
                        start_location['lng'],
                        station['lat'],
                        station['lng']
                    )
                else:
                    distance = haversine_distance(
                        charging_stations[int(current_vertex)]['lat'],
                        charging_stations[int(current_vertex)]['lng'],
                        station['lat'],
                        station['lng']
                    )

                new_distance = distances[current_vertex] + distance
                if new_distance < distances[vertex]:
                    distances[vertex] = new_distance
                    previous[vertex] = current_vertex
                    heappush(pq, (new_distance, vertex))

    return None, []

def main():
    # Read input from Node.js
    start_location = json.loads(sys.argv[1])

    # Mock charging stations data (in real application, this would come from a database)
    charging_stations = [
        {"lat": 12.9716, "lng": 77.5946, "name": "Bangalore Central"},
        {"lat": 13.0827, "lng": 80.2707, "name": "Chennai Central"},
        {"lat": 17.3850, "lng": 78.4867, "name": "Hyderabad Central"},
        {"lat": 19.0760, "lng": 72.8777, "name": "Mumbai Central"},
        {"lat": 28.6139, "lng": 77.2090, "name": "Delhi Central"}
    ]

    # Find nearest station
    nearest_station, path = dijkstra(start_location, charging_stations)

    # Prepare response
    response = {
        "success": True,
        "nearest_station": nearest_station,
        "path": path
    }

    # Send response back to Node.js
    print(json.dumps(response))

if __name__ == "__main__":
    main()
