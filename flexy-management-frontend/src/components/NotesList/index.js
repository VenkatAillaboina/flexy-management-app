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

  const renderLoadingView = () => <LoadingView />;
  const renderFailureView = () => <FailureView message="Failed to fetch flexys." />;

  const renderSuccessView = () => (
    <div className="notes-list-container">
      <h2>All Locations</h2>
      <div className="notes-list">
        {flexys.map((flexy) => (
          <div key={flexy._id} className="note-item">
            <img src={flexy.imageUrl} alt={flexy.name} className="flexy-image" />
            <div className="flexy-details">
                <h3>{flexy.name}</h3>
                <p><strong>Address:</strong> {flexy.address}</p>
                <p><strong>Status:</strong> {flexy.status}</p>
                <Link to={`/notes/${flexy._id}`} className="view-details-btn">View / Edit Details</Link>
            </div>
          </div>
        ))}
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