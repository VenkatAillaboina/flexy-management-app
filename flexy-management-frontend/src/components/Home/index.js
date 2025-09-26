import { useState, useEffect } from 'react';
import MapComponent from '../MapComponent';
import FlexyForm from '../FlexyForm';
import Loader from '../Loader';
import './index.css';

const fallbackCenter = {
  lat: 17.9689, // Warangal
  lng: 79.5941
};

const Home = ({ addFlexy }) => {
  const [currentCenter, setCurrentCenter] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = { lat: latitude, lng: longitude };
          setCurrentCenter(userLocation);
          setMarkerPosition(userLocation);
        },
        () => {
          console.error("Could not get location. Defaulting to fallback.");
          setCurrentCenter(fallbackCenter);
          setMarkerPosition(fallbackCenter);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCurrentCenter(fallbackCenter);
      setMarkerPosition(fallbackCenter);
    }
  }, []);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
  };

  if (!currentCenter) {
    return <Loader />;
  }

  return (
    <div className="home-container">
      <MapComponent 
        onMapClick={handleMapClick} 
        markerPosition={markerPosition} 
        center={currentCenter} // Use the new dynamic center prop
      />
      <FlexyForm onFormSubmit={addFlexy} pinnedLocation={markerPosition} />
    </div>
  );
};

export default Home;