import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FlexyForm from '../FlexyForm';
import Loader from '../Loader';
import MapComponent from '../MapComponent';
import axios from 'axios';
import './index.css';

const API_URL = 'http://localhost:8080';

const NoteDetails = () => {
  const { id } = useParams();
  const [flexy, setFlexy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    const fetchFlexy = async () => {
      try {
        const response = await axios.get(`${API_URL}/hoardings/${id}`);
        const fetchedFlexy = response.data.data;
        setFlexy(fetchedFlexy);

        if (fetchedFlexy && fetchedFlexy.location && fetchedFlexy.location.coordinates) {
          const [lng, lat] = fetchedFlexy.location.coordinates;
          setMapCenter({ lat, lng });
        }

      } catch (error) {
        console.error("Failed to fetch flexy details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlexy();
  }, [id]);

  if (loading || (flexy && !mapCenter)) {
    return <Loader />;
  }

  if (!flexy) {
    return (
      <div>
        <h2>Flexy not found!</h2>
        <Link to="/notes">Back to list</Link>
      </div>
    );
  }

  return (
    <div className="note-details-container">
      <MapComponent
        markerPosition={mapCenter}
        center={mapCenter}
      />
      <FlexyForm existingFlexy={flexy} pinnedLocation={mapCenter} />
    </div>
  );
};

export default NoteDetails;