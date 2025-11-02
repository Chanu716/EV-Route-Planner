import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, DirectionsRenderer, Marker, Autocomplete } from '@react-google-maps/api';
import { carModels, calculateRange, type CarModel } from './data/carModels';
import SignIn from './components/SignIn';
import Features from './components/Features';
import Contact from './components/Contact';
import ChargingStations from './components/ChargingStations';
import {
  Car,
  MapPin,
  Battery,
  Menu,
  ChevronRight,
  Zap,
  LineChart,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Sun,
  Moon
} from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showChargingStations, setShowChargingStations] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [chargeType, setChargeType] = useState('Fast Charge');
  const [selectedCar, setSelectedCar] = useState<CarModel>(carModels[0]);
  const [currentRange, setCurrentRange] = useState<number>(carModels[0].baseRange);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chargingStations, setChargingStations] = useState<google.maps.places.PlaceResult[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [_currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  
  // Refs for autocomplete
  const startAutocomplete = useRef<google.maps.places.Autocomplete | null>(null);
  const destAutocomplete = useRef<google.maps.places.Autocomplete | null>(null);

  const onStartPlaceChanged = () => {
    const place = startAutocomplete.current?.getPlace();
    if (place?.formatted_address) {
      setStartLocation(place.formatted_address);
    }
  };

  const onDestPlaceChanged = () => {
    const place = destAutocomplete.current?.getPlace();
    if (place?.formatted_address) {
      setDestination(place.formatted_address);
    }
  };

  const findChargingStations = useCallback(async (route: google.maps.DirectionsRoute) => {
    if (!map) return;
    
    const placesService = new google.maps.places.PlacesService(map);
    const searchPoints: google.maps.LatLng[] = [];
    
    // Process each leg of the route
    if (route.legs) {
      for (const leg of route.legs) {
        // Add points from each step in the leg
        if (leg.steps) {
          for (const step of leg.steps) {
            // Add the start location of each step
            searchPoints.push(step.start_location);
            
            // If the step is longer than 10km, add intermediate points
            if (step.distance && step.distance.value > 10000) {
              const numPoints = Math.floor(step.distance.value / 10000); // One point every 10km
              const stepPath = step.path || [];
              
              for (let i = 1; i < numPoints && i < stepPath.length; i++) {
                const progress = i / numPoints;
                const point = google.maps.geometry.spherical.interpolate(
                  step.start_location,
                  step.end_location,
                  progress
                );
                searchPoints.push(point);
              }
            }
            
            // Add the end location of each step
            searchPoints.push(step.end_location);
          }
        }
      }
    }
    
    const searchPromises = searchPoints.map(point => {
      const request = {
        location: point,
        radius: 2500, // 2.5km radius
        keyword: 'electric vehicle charging station',
        type: 'establishment'
      };
      
      return new Promise<google.maps.places.PlaceResult[]>((resolve) => {
        placesService.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results.filter(place => {
              const name = place.name?.toLowerCase() || '';
              const types = place.types || [];
              return name.includes('charg') || 
                     name.includes('ev') || 
                     name.includes('electric') ||
                     types.includes('parking') ||
                     types.includes('gas_station') ||
                     types.includes('car_dealer') ||
                     types.includes('car_repair');
            }));
          } else {
            resolve([]);
            console.log('Places service status:', status);
          }
        });
      });
    });
    
    try {
      const results = await Promise.all(searchPromises);
      const uniqueStations = new Map<string, google.maps.places.PlaceResult>();
      
      results.flat().forEach(station => {
        if (station.place_id && !uniqueStations.has(station.place_id)) {
          uniqueStations.set(station.place_id, station);
        }
      });
      
      setChargingStations(Array.from(uniqueStations.values()));
      console.log('Found charging stations:', uniqueStations.size);
    } catch (error) {
      console.error('Error finding charging stations:', error);
    }
  }, [map]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a central location if geolocation fails
          setCurrentLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleSignIn = (email: string, password: string) => {
    // Here you would typically make an API call to authenticate the user
    if (email && password) {
      setUser({ email });
      setIsAuthenticated(true);
      setShowSignIn(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (showSignIn) {
    return <SignIn onSignIn={handleSignIn} onClose={() => setShowSignIn(false)} />;
  }

  if (showFeatures || showContact || showChargingStations) {
    return (
      <div className="min-h-screen gradient-bg">
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">ChargeFlow</span>
            </div>
            <button
              onClick={() => {
                setShowFeatures(false);
                setShowContact(false);
                setShowChargingStations(false);
              }}
              className="text-white hover:text-teal-500 transition-colors flex items-center gap-2"
            >
              <ChevronRight className="h-5 w-5" />
              Back to Map
            </button>
          </div>
        </nav>
        {showFeatures ? <Features /> : showContact ? <Contact /> : <ChargingStations />}
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Floating Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="glassmorphism rounded-2xl">
            <div className="flex justify-between items-center h-16 px-6">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold text-white">ChargeFlow</span>
                <div className="hidden md:flex items-center space-x-8 ml-10">
                  <button 
                    onClick={() => setShowFeatures(true)}
                    className="text-white hover:text-teal-500 transition-colors"
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => {
                      const routePlannerSection = document.getElementById('route-planner');
                      if (routePlannerSection) {
                        routePlannerSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-white hover:text-teal-500 transition-colors"
                  >
                    Route Planner
                  </button>
                  <button
                    onClick={() => setShowChargingStations(true)}
                    className="text-white hover:text-teal-500 transition-colors"
                  >
                    Charging Stations
                  </button>
                  <button
                    onClick={() => setShowContact(true)}
                    className="text-white hover:text-teal-500 transition-colors"
                  >
                    Contact
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {isAuthenticated && (
                  <span className="text-white/80">{user?.email}</span>
                )}
                <button
                  onClick={() => isAuthenticated ? handleSignOut() : setShowSignIn(true)}
                  className="px-6 py-3 text-lg rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-colors"
                >
                  {isAuthenticated ? 'Sign Out' : 'Sign In'}
                </button>
                <div 
                  className={`theme-toggle ${isDark ? 'dark' : ''} flex items-center justify-between px-2`}
                  onClick={toggleTheme}
                  role="button"
                  aria-label="Toggle theme"
                >
                  <Sun className="h-4 w-4 text-white absolute left-2" />
                  <Moon className="h-4 w-4 text-white absolute right-2" />
                  <span className="sr-only">Toggle theme</span>
                </div>
                <button className="md:hidden ml-4">
                  <Menu className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                Optimize Your EV Journey
              </h1>
              <p className="mt-3 text-lg text-white/80">
                Real-time traffic. Live charging station updates. Intelligent route planning.
              </p>

            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <div className="glassmorphism p-2 rounded-2xl">
                <img 
                  src="/ev-charging.jpg"
                  alt="Electric Vehicle Charging"
                  className="rounded-xl w-full h-[400px] object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800';
                    target.onerror = null;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Planner Section */}
      <div id="route-planner" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glassmorphism rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-white">Plan Your Route</h2>
                <p className="text-white/80">Find the most efficient route with charging stations along the way.</p>
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <Autocomplete
                      onLoad={autocomplete => startAutocomplete.current = autocomplete}
                      onPlaceChanged={onStartPlaceChanged}
                    >
                      <input
                        type="text"
                        placeholder="Starting Point"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                    </Autocomplete>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <Autocomplete
                      onLoad={autocomplete => destAutocomplete.current = autocomplete}
                      onPlaceChanged={onDestPlaceChanged}
                    >
                      <input
                        type="text"
                        placeholder="Destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                    </Autocomplete>
                  </div>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <select
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none"
                      value={selectedCar.id}
                      onChange={(e) => {
                        const car = carModels.find(c => c.id === e.target.value);
                        if (car) {
                          setSelectedCar(car);
                          setCurrentRange(calculateRange(car.baseRange, batteryLevel));
                        }
                      }}
                    >
                      {carModels.map(car => (
                        <option key={car.id} value={car.id} className="bg-gray-800">
                          {car.brand} {car.name} - {car.chargingPort}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Battery className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                      <input
                        type="number"
                        placeholder="Battery %"
                        value={batteryLevel}
                        onChange={(e) => {
                          const newLevel = Number(e.target.value);
                          setBatteryLevel(newLevel);
                          setCurrentRange(calculateRange(selectedCar.baseRange, newLevel));
                        }}
                        min="0"
                        max="100"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                    </div>
                    <div className="relative">
                      <Zap className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                      <select 
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none"
                        value={chargeType}
                        onChange={(e) => setChargeType(e.target.value)}
                      >
                        <option className="bg-gray-800">Fast Charge</option>
                        <option className="bg-gray-800">Super Fast</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl border border-white/20 mb-4">
                    <div className="flex justify-between items-center text-white">
                      <div>
                        <p className="text-lg">Current Range:</p>
                        <p className="text-3xl font-bold">{currentRange} km</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg">Charging Port:</p>
                        <p className="text-xl font-semibold">{selectedCar.chargingPort}</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      setError(null);
                      if (!startLocation || !destination) {
                        setError('Please enter both start and destination locations');
                        return;
                      }

                      const directionsService = new google.maps.DirectionsService();
                      try {
                        const result = await directionsService.route({
                          origin: startLocation,
                          destination: destination,
                          travelMode: google.maps.TravelMode.DRIVING,
                          optimizeWaypoints: true
                        });

                        setDirections(result);
                        
                        // Find charging stations along the route
                        if (result.routes[0]) {
                          await findChargingStations(result.routes[0]);
                        }
                      } catch (error) {
                        setError('Could not calculate route. Please check your inputs.');
                      }
                      try {
                        const directionsService = new google.maps.DirectionsService();
                        directionsService.route(
                          {
                            origin: startLocation,
                            destination: destination,
                            travelMode: google.maps.TravelMode.DRIVING,
                            optimizeWaypoints: true
                          },
                          (result, status) => {
                            if (status === google.maps.DirectionsStatus.OK) {
                              setDirections(result);
                              setError(null);
                            } else {
                              setError('Could not find a route between these locations. Please check the addresses and try again.');
                              console.error('Error fetching directions:', status);
                            }
                          }
                        );
                      } catch (err) {
                        setError('An error occurred while calculating the route. Please try again.');
                        console.error('Error:', err);
                      }
                    }}
                    className="w-full glassmorphism text-white py-3 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    Find Optimal Route
                  </button>
                  {error && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                </div>
              </div>
              <div className={`${isFullScreen ? 'fixed inset-0 z-50' : 'h-[600px]'} rounded-xl overflow-hidden relative`}>
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="absolute top-4 right-4 z-10 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                >
                  {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                </button>
                <GoogleMap
                  onLoad={map => setMap(map)}
                  mapContainerStyle={{
                    width: '100%',
                    height: '100%'
                  }}
                  zoom={14}
                  center={{
                    lat: 37.7749,
                    lng: -122.4194
                  }}
                  options={{
                    styles: isDark ? [
                      {
                        featureType: 'all',
                        elementType: 'geometry',
                        stylers: [{ color: '#242f3e' }]
                      },
                      {
                        featureType: 'all',
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#242f3e' }]
                      },
                      {
                        featureType: 'all',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#746855' }]
                      }
                    ] : [],
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: true,
                    scaleControl: true,
                    streetViewControl: true,
                    rotateControl: true,
                    fullscreenControl: false
                  }}
                >
                  {directions && (
                    <>
                      <DirectionsRenderer
                        directions={directions}
                        options={{
                          suppressMarkers: false,
                          polylineOptions: {
                            strokeColor: '#4ade80',
                            strokeWeight: 5
                          }
                        }}
                      />
                      {chargingStations.map((station, index) => {
                        const position = station.geometry?.location;
                        if (!position) return null;
                        
                        return (
                          <Marker
                            key={`${station.place_id}-${index}`}
                            position={{
                              lat: position.lat(),
                              lng: position.lng()
                            }}
                            icon={{
                              url: '/charging-station.svg',
                              scaledSize: new google.maps.Size(40, 40)
                            }}
                            title={station.name}
                          />
                        );
                      })}
                    </>
                  )}
                </GoogleMap>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glassmorphism p-8 rounded-2xl text-center">
              <LineChart className="h-10 w-10 mx-auto mb-4 text-white" />
              <div className="text-6xl font-bold text-white">95%</div>
              <div className="mt-3 text-lg text-white/80">Route Efficiency</div>
            </div>
            <div className="glassmorphism p-8 rounded-2xl text-center">
              <Zap className="h-10 w-10 mx-auto mb-4 text-white" />
              <div className="text-6xl font-bold text-white">2.5K</div>
              <div className="mt-3 text-lg text-white/80">Charging Stations</div>
            </div>
            <div className="glassmorphism p-8 rounded-2xl text-center">
              <Car className="h-10 w-10 mx-auto mb-4 text-white" />
              <div className="text-6xl font-bold text-white">50K+</div>
              <div className="mt-3 text-lg text-white/80">Happy Drivers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glassmorphism rounded-2xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center">
                  <Car className="h-10 w-10 text-white" />
                  <span className="ml-2 text-2xl font-bold text-white">ChargeFlow</span>
                </div>
                <p className="mt-4 text-white/80">
                  Optimizing your electric vehicle journey with smart technology.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white/80 hover:text-white transition-colors">Home</a></li>
                  <li><a href="#" className="text-white/80 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-white/80 hover:text-white transition-colors">Route Planner</a></li>
                  <li><a href="#" className="text-white/80 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Connect</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    <Github className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Newsletter</h3>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button className="glassmorphism px-6 py-2 rounded-xl text-white hover:bg-white/20 transition-colors whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20 text-center text-white/80">
              <p>© 2024 ChargeFlow. All rights reserved.</p>
              <p className="mt-2">Built with ❤️ by ChargeFlow Team</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;