import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingView from '../LoadingView';
import FailureView from '../FailureView';
import './index.css';

const API_URL = process.env.REACT_APP_BACKEND_API;

const STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILURE: 'failure',
};

const NotesList = () => {
  const [flexys, setFlexys] = useState([]);
  const [status, setStatus] = useState(STATUS.LOADING);

  const fetchFlexys = useCallback(async () => {
    setStatus(STATUS.LOADING);
    try {
      const response = await axios.get(`${API_URL}/hoardings`);
      setFlexys(response.data.data || []);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      console.error("Failed to fetch flexys:", error);
      setStatus(STATUS.FAILURE);
    }
  }, []);

  useEffect(() => {
    fetchFlexys();
  }, [fetchFlexys]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hoarding? This action cannot be undone.')) {
      setStatus(STATUS.LOADING); // show loading while deleting
      try {
        await axios.delete(`${API_URL}/hoardings/${id}`);
        setFlexys(prevFlexys => prevFlexys.filter(flexy => flexy._id !== id));
        setStatus(STATUS.SUCCESS); // back to success state after delete
      } catch (error) {
        console.error("Failed to delete hoarding:", error);
        setStatus(STATUS.FAILURE); // show failure state
      }
    }
  };

  const renderLoadingView = () => <LoadingView />;
  const renderFailureView = () => (
    <FailureView message="Something went wrong. Please try again." onRetry={fetchFlexys} />
  );

  const renderNoResultsView = () => (
    <div className="no-results-container">
      <img
        src="https://res.cloudinary.com/du8lwvfjj/image/upload/v1758383294/not-result_usbnmo.svg"
        alt="No Results Found"
        className="no-results-img"
      />
      <p className="status-message">It looks like you haven't added any hoardings yet!</p>
      <p className="status-message">Click 'Add New' to get started.</p>
    </div>
  );

  const renderSuccessView = () => (
    <div className="notes-list-container">
      {flexys.length > 0 && <h2>All Flexys</h2>}
      {flexys.length > 0 ? (
        <div className="notes-list">
          {flexys.map((flexy) => (
            <div key={flexy._id} className="note-item">
              <img src={flexy.imageUrl} alt={flexy.name || 'N/A'} className="flexy-image" />
              <div className="flexy-details">
                <h3>{flexy.name || 'N/A'}</h3>
                <p><strong>Address:</strong> {flexy.address || 'N/A'}</p>
                <p><strong>Status:</strong> {flexy.status || 'N/A'}</p>
                <div className="note-item-actions">
                  <Link to={`/notes/${flexy._id}`} className="view-details-btn">View / Edit</Link>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDelete(flexy._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        renderNoResultsView()
      )}
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
