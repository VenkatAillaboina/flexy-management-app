import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import FlexyForm from '../FlexyForm';
import './index.css';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 17.6868, 
  lng: 83.2185
};

const Home = ({ addFlexy }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" 
  });

  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    map.setZoom(12);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
  };

  return (
    <div className="home-container">
      <div className="map-container">
        <h3>Click on the Map to Pin a Location</h3>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
          >
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
        ) : (
          <div>Loading Map...</div>
        )}
      </div>
      <FlexyForm onFormSubmit={addFlexy} pinnedLocation={markerPosition} />
    </div>
  );
};

export default Home;