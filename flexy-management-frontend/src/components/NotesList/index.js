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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flexy?')) {
      try {
        await axios.delete(`${API_URL}/hoardings/${id}`);
        setFlexys(flexys.filter(flexy => flexy._id !== id));
        alert('Flexy deleted successfully!');
      } catch (error) {
        console.error("Failed to delete flexy:", error);
        alert('Failed to delete flexy. Please try again.');
      }
    }
  };

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
              <div className="card-actions">
                <Link to={`/notes/${flexy._id}`} className="details-link">View / Edit</Link>
                <button onClick={() => handleDelete(flexy._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;