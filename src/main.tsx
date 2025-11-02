import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LoadScript } from '@react-google-maps/api';
import App from './App.tsx';
import './index.css';

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const libraries: ("places" | "geometry" | "drawing")[] = ["places", "geometry", "drawing"];

if (!googleMapsApiKey) {
  console.error('Google Maps API key is missing! Add VITE_GOOGLE_MAPS_API_KEY to your environment variables.');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={libraries}
      loadingElement={<div>Loading Maps...</div>}
    >
      <App />
    </LoadScript>
  </StrictMode>
);
