import { useState } from 'react';
import MapComponent from '../MapComponent';
import FlexyForm from '../FlexyForm';
import './index.css';

const Home = ({ addFlexy }) => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleLocationSelect = (location) => {

    setMarkerPosition({ lat: location.lat, lng: location.lng });
  };

  return (
    <div className="home-container">
      <MapComponent 
        onLocationSelect={handleLocationSelect} 
        markerPosition={markerPosition} 
      />
      <FlexyForm onFormSubmit={addFlexy} pinnedLocation={markerPosition} />
    </div>
  );
};

export default Home;