import { useState, useEffect } from 'react';
import {
  Zap,
  MapPin,
  Battery,
  Clock,
  Navigation,
  Filter
} from 'lucide-react';

interface ChargingStation {
  id: string;
  name: string;
  address: string;
  distance: string;
  connectorTypes: string[];
  availability: {
    total: number;
    available: number;
  };
  rating: number;
  pricing: string;
  amenities: string[];
}

const mockStations: ChargingStation[] = [
  {
    id: '1',
    name: 'Tesla Supercharger',
    address: 'Hitech City, Hyderabad',
    distance: '0.5 km',
    connectorTypes: ['Tesla', 'CCS2'],
    availability: { total: 8, available: 3 },
    rating: 4.8,
    pricing: '₹15/kWh',
    amenities: ['Restroom', 'Cafe', 'WiFi']
  },
  {
    id: '2',
    name: 'ChargeZone Hub',
    address: 'Jubilee Hills, Hyderabad',
    distance: '2.1 km',
    connectorTypes: ['CCS2', 'CHAdeMO', 'Type 2'],
    availability: { total: 6, available: 4 },
    rating: 4.5,
    pricing: '₹12/kWh',
    amenities: ['Parking', 'Restroom', '24/7']
  },
  {
    id: '3',
    name: 'Tata Power Station',
    address: 'Banjara Hills, Hyderabad',
    distance: '3.2 km',
    connectorTypes: ['CCS2', 'Type 2'],
    availability: { total: 4, available: 2 },
    rating: 4.3,
    pricing: '₹13/kWh',
    amenities: ['Parking', 'Shopping']
  },
  {
    id: '4',
    name: 'Ather Grid',
    address: 'Madhapur, Hyderabad',
    distance: '1.8 km',
    connectorTypes: ['Type 2', 'Bharat AC'],
    availability: { total: 3, available: 1 },
    rating: 4.6,
    pricing: '₹14/kWh',
    amenities: ['24/7', 'Security']
  },
  {
    id: '5',
    name: 'MG Charge Hub',
    address: 'Gachibowli, Hyderabad',
    distance: '4.5 km',
    connectorTypes: ['CCS2', 'Type 2', 'GB/T'],
    availability: { total: 5, available: 3 },
    rating: 4.4,
    pricing: '₹13.5/kWh',
    amenities: ['Cafe', 'WiFi', 'Restroom']
  }
];

const connectorTypes = [
  'All Types',
  'CCS2',
  'CHAdeMO',
  'Type 2',
  'Tesla',
  'GB/T',
  'Bharat AC'
];

const ChargingStations = () => {
  const [selectedConnector, setSelectedConnector] = useState('All Types');
  const [userLocation, setUserLocation] = useState<string>('');
  const [filteredStations, setFilteredStations] = useState(mockStations);

  useEffect(() => {
    // Get user's location (mock for now)
    setUserLocation('Hitech City, Hyderabad');

    // Filter stations based on selected connector
    if (selectedConnector === 'All Types') {
      setFilteredStations(mockStations);
    } else {
      setFilteredStations(
        mockStations.filter(station =>
          station.connectorTypes.includes(selectedConnector)
        )
      );
    }
  }, [selectedConnector]);

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className="min-h-screen gradient-bg py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Nearby Charging Stations
          </h1>
          <p className="text-xl text-white/60 mb-8">
            Find compatible charging stations near {userLocation}
          </p>

          {/* Connector Type Filter */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Filter className="h-5 w-5 text-white" />
            <div className="flex gap-2 flex-wrap justify-center">
              {connectorTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedConnector(type)}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    selectedConnector === type
                      ? 'bg-teal-500 text-white'
                      : 'glassmorphism text-white hover:bg-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map(station => (
            <div
              key={station.id}
              className="glassmorphism rounded-2xl p-6 transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {station.name}
                  </h3>
                  <div className="flex items-center text-white/60 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {station.address}
                  </div>
                </div>
                <span className="text-white/80 text-sm">
                  <Navigation className="h-4 w-4 inline mr-1" />
                  {station.distance}
                </span>
              </div>

              {/* Connector Types */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {station.connectorTypes.map(type => (
                    <span
                      key={type}
                      className="px-2 py-1 rounded-lg bg-white/10 text-white text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-white">
                  <Battery className="h-5 w-5 mr-2 text-teal-500" />
                  <span>
                    {station.availability.available}/{station.availability.total} Available
                  </span>
                </div>
                <div className="text-white">
                  <Clock className="h-4 w-4 inline mr-1" />
                  <span>24/7</span>
                </div>
              </div>

              {/* Rating and Price */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-yellow-400">
                  {renderStars(station.rating)}
                  <span className="text-white/60 ml-2">{station.rating}</span>
                </div>
                <div className="text-white">
                  <Zap className="h-4 w-4 inline mr-1 text-teal-500" />
                  {station.pricing}
                </div>
              </div>

              {/* Amenities */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex flex-wrap gap-2">
                  {station.amenities.map(amenity => (
                    <span
                      key={amenity}
                      className="px-2 py-1 rounded-lg bg-white/5 text-white/60 text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChargingStations;
