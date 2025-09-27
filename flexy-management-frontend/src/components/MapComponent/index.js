import { useCallback, useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import LoadingView from '../LoadingView';
import './index.css';

const MapComponent = ({ onMapClick, markers, center, directions }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBYoE-nQMz-mzdTdKjyJAVv_F3G5eIq5sM",
    libraries: ['geometry', 'places'],
  });

  const [map, setMap] = useState(null);
  const clusterer = useRef(null);

  const customMarkerIcon = isLoaded ? {
    url: 'https://res.cloudinary.com/disrq2eh8/image/upload/v1758967291/placeholder_ww4rii.png',
    scaledSize: new window.google.maps.Size(40, 40),
  } : null;

  useEffect(() => {
    if (map && isLoaded) {
      if (clusterer.current) {
        clusterer.current.clearMarkers();
      }

      const mapMarkers = markers.map(marker => new window.google.maps.Marker({
        position: marker,
        icon: customMarkerIcon,
      }));

      clusterer.current = new MarkerClusterer({ map, markers: mapMarkers });
    }
  }, [map, markers, isLoaded, customMarkerIcon]);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    map.setZoom(14);
    setMap(map);
  }, [center]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return <LoadingView />;
  }

  return (
    <div className="map-container-inner">
      <GoogleMap
        mapContainerClassName="map-google-container"
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;