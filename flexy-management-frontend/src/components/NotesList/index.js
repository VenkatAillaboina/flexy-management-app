import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const NotesList = () => {
  const [flexys, setFlexys] = useState([]);
  const [status, setStatus] = useState(STATUS.LOADING);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);

  useEffect(() => {
    const fetchFlexys = async () => {
      setStatus(STATUS.LOADING);
      try {
        const response = await axios.get(`${API_URL}/hoardings`);
        const fetchedFlexys = response.data.data || [];
        setFlexys(fetchedFlexys);
        const hoardingMarkers = fetchedFlexys.map(flexy => {
          const [lng, lat] = flexy.location.coordinates;
          return { lat, lng };
        });
        setMarkers(hoardingMarkers);
        setFilteredMarkers(hoardingMarkers);
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
    if (source && destination && window.google) {
      try {
        const [sourceCoords, destCoords] = await Promise.all([
          getCoordinates(source),
          getCoordinates(destination),
        ]);

        const response = await axios.post(`${API_URL}/hoardings/along-route`, {
          source: [sourceCoords.lng(), sourceCoords.lat()],
          destination: [destCoords.lng(), destCoords.lat()],
        });

        const alongRouteFlexys = response.data.data || [];
        const alongRouteMarkers = alongRouteFlexys.map(flexy => {
          const [lng, lat] = flexy.location.coordinates;
          return { lat, lng };
        });
        setFilteredMarkers(alongRouteMarkers);

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: source,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDirections(result);
            } else {
              console.error(`error fetching directions ${result}`);
            }
          }
        );
      } catch (error) {
        console.error("Error during route search:", error);
      }
    }
  };


  const clearRoute = () => {
    setDirections(null);
    setFilteredMarkers(markers);
    setSource('');
    setDestination('');
  };

  const renderLoadingView = () => <LoadingView />;
  const renderFailureView = () => <FailureView message="Failed to fetch flexys." />;

  const renderSuccessView = () => (
    <div className="notes-container">
      <div className="left-panel">
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
          <button onClick={handleRouteSearch}>Find Route</button>
          <button onClick={clearRoute} className="clear-btn">Clear</button>
        </div>
        <MapComponent
          center={{ lat: 17.9689, lng: 79.5941 }}
          markers={filteredMarkers}
          directions={directions}
        />
      </div>
      <div className="right-panel">
        <h2>All Locations</h2>
        <div className="notes-list">
          {flexys.map((flexy) => (
            <div key={flexy._id} className="note-item">
              <h3>{flexy.name}</h3>
              <p><strong>Address:</strong> {flexy.address}</p>
              <p><strong>Status:</strong> {flexy.status}</p>
              <Link to={`/notes/${flexy._id}`}>View Details</Link>
            </div>
          ))}
        </div>
      </div>
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

export default NotesList;