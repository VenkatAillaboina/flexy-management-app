import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader';
import './index.css';

const API_URL = 'http://localhost:8080';

const NotesList = () => {
  const [flexys, setFlexys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlexys = async () => {
      try {
        const response = await axios.get(`${API_URL}/hoardings`);
        setFlexys(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch flexys:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlexys();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (flexys.length === 0) {
    return (
      <div className="notes-list-container">
        <h2>All Flexys</h2>
        <p>No flexys have been added yet. Go to the <Link to="/">Home</Link> page to add one.</p>
      </div>
    );
  }

  return (
    <div className="notes-list-container">
      <h2>All Flexys</h2>
      <div className="notes-cards-grid">
        {flexys.map((flexy) => (
          <div key={flexy._id} className="note-card">
            <img src={flexy.imageUrl} alt={flexy.name} className="note-card-image" />
            <div className="note-card-content">
              <h3>{flexy.name}</h3>
              <p><strong>Address:</strong> {flexy.address}</p>
              <p><strong>Status:</strong> {flexy.status}</p>
              <Link to={`/notes/${flexy._id}`} className="details-link">View / Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;