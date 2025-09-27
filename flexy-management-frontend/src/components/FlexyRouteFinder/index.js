import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingView from '../LoadingView';
import FailureView from '../FailureView';
import MapComponent from '../MapComponent';
import './index.css';

const API_URL = 'http://localhost:8080';

const STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILURE: 'failure',
};

const FlexyRouteFinder = () => {
  const [status, setStatus] = useState(STATUS.SUCCESS);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchFlexys = async () => {
      setStatus(STATUS.LOADING);
      try {
        const response = await axios.get(`${API_URL}/hoardings`);
        const fetchedFlexys = response.data.data || [];
        setMarkers(fetchedFlexys);
        setStatus(STATUS.SUCCESS);
      } catch (error) {
        console.error("Failed to fetch flexys:", error);
        setStatus(STATUS.FAILURE);
      }
    };
    fetchFlexys();
  }, []);

  const getCoordinates = async (address) => {
    if (!window.google) return null;
    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          resolve(results[0].geometry.location);
        } else {
          reject(new Error('Geocode was not successful for the following reason: ' + status));
        }
      });
    });
  };

  const handleRouteSearch = async () => {
    if (source && destination) {
        setStatus(STATUS.LOADING)
      try {
        const [sourceCoords, destCoords] = await Promise.all([
          getCoordinates(source),
          getCoordinates(destination),
        ]);

        const response = await axios.post(`${API_URL}/hoardings/find-in-between`, {
          source: [sourceCoords.lng(), sourceCoords.lat()],
          destination: [destCoords.lng(), destCoords.lat()],
        });

        const alongRouteFlexys = response.data.data || [];
        setMarkers(alongRouteFlexys);
        
      } catch (error) {
        console.error("Error during route search:", error);
        setStatus(STATUS.FAILURE)
      }
      finally{
        setStatus(STATUS.SUCCESS)
      }
    }
  };


  const clearRoute = () => {
    setMarkers([]);
    setSource('');
    setDestination('');
  };

  const renderLoadingView = () => <LoadingView />;
  const renderFailureView = () => <FailureView message="Failed to fetch flexys." />;

  const renderSuccessView = () => (
    <div className="route-finder-container">
        <h2 className="map-title">Flexy Route Finder</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter starting point"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <button onClick={handleRouteSearch}>Find Hoardings</button>
          <button onClick={clearRoute} className="clear-btn">Clear</button>
        </div>
        <MapComponent
          center={{ lat: 17.9689, lng: 79.5941 }}
          markers={markers}
        />
    </div>
  );

  const renderView = () => {
    switch (status) {
      case STATUS.LOADING:
        return renderLoadingView();
      case STATUS.FAILURE:
        return renderFailureView();
      case STATUS.SUCCESS:
        return renderSuccessView();
      default:
        return null;
    }
  };

  return <>{renderView()}</>;
};

export default FlexyRouteFinder;