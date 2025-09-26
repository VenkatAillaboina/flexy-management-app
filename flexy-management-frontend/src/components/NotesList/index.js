import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingView from '../LoadingView';
import FailureView from '../FailureView';
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
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchFlexys = async () => {
      setStatus(STATUS.LOADING);
      try {
        const response = await axios.get(`${API_URL}/hoardings`);
        setFlexys(response.data.data || []);
        setStatus(STATUS.SUCCESS);
      } catch (error) {
        console.error("Failed to fetch flexys:", error);
        setStatus(STATUS.FAILURE);
      }
    };
    fetchFlexys();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flexy?')) {
      setDeletingId(id);
      try {
        await axios.delete(`${API_URL}/hoardings/${id}`);
        setFlexys(flexys.filter(flexy => flexy._id !== id));
      } catch (error) {
        console.error("Failed to delete flexy:", error);
        alert('Failed to delete flexy. Please try again.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const renderLoadingView = () => <LoadingView />;

  const renderFailureView = () => <FailureView message="Failed to fetch flexys." />;

  const renderSuccessView = () => {
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
                  <button
                    onClick={() => handleDelete(flexy._id)}
                    className="delete-btn"
                    disabled={deletingId === flexy._id}
                  >
                    {deletingId === flexy._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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