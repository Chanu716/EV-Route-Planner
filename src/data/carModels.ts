interface CarModel {
  id: string;
  name: string;
  brand: string;
  chargingPort: string;
  baseRange: number; // Range in km at 100% battery
  batteryCapacity: number; // in kWh
  image: string;
}

export const carModels: CarModel[] = [
  {
    id: 'tesla-model3',
    name: 'Model 3',
    brand: 'Tesla',
    chargingPort: 'Tesla/CCS',
    baseRange: 576, // EPA range in km
    batteryCapacity: 82,
    image: 'https://example.com/tesla-model3.jpg'
  },
  {
    id: 'ioniq5',
    name: 'IONIQ 5',
    brand: 'Hyundai',
    chargingPort: 'CCS',
    baseRange: 488,
    batteryCapacity: 77.4,
    image: 'https://example.com/ioniq5.jpg'
  },
  {
    id: 'id4',
    name: 'ID.4',
    brand: 'Volkswagen',
    chargingPort: 'CCS',
    baseRange: 452,
    batteryCapacity: 82,
    image: 'https://example.com/id4.jpg'
  },
  {
    id: 'leaf',
    name: 'Leaf',
    brand: 'Nissan',
    chargingPort: 'CHAdeMO',
    baseRange: 363,
    batteryCapacity: 62,
    image: 'https://example.com/leaf.jpg'
  },
  {
    id: 'mache',
    name: 'Mustang Mach-E',
    brand: 'Ford',
    chargingPort: 'CCS',
    baseRange: 505,
    batteryCapacity: 88,
    image: 'https://example.com/mach-e.jpg'
  }
];

export const chargingPortTypes = {
  'CCS': 'Combined Charging System - Most common in Europe and America',
  'CHAdeMO': 'Common in Japanese vehicles like Nissan',
  'Tesla/CCS': 'Tesla\'s proprietary port with CCS adapter support',
  'Type 2': 'Standard AC charging port in Europe'
};

export function calculateRange(baseRange: number, batteryLevel: number): number {
  return Math.round((baseRange * batteryLevel) / 100);
}

export type { CarModel };
