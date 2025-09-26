import { useCallback, useState, useEffect } from 'react'; // Import useEffect
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Loader from '../Loader';
import './index.css';

const MapComponent = ({ onMapClick, markerPosition, center }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: ""
  });

  const [map, setMap] = useState(null);

  // This hook runs when the map instance is ready and when the center prop changes.
  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [map, center]); // Re-run this effect if map or center changes

  const onLoad = useCallback(function callback(map) {
    // Set the initial bounds when the map first loads
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    map.setZoom(14); // A closer zoom level
    setMap(map);
  }, [center]); // Depend on the initial center

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return <Loader />;
  }

  return (
    <div className="map-container-inner">
      <h3>Click on the Map to Pin a Location</h3>
      <GoogleMap
        mapContainerClassName="map-google-container"
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;