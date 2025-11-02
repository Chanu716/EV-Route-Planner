import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Load Google Maps API
const loadGoogleMapsScript = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  if (!apiKey) {
    console.warn('Google Maps API key is not set. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file');
  }
  
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,drawing`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

loadGoogleMapsScript();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
