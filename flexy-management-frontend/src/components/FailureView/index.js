import React from 'react';
import './index.css';

const FailureView = ({ message = 'Failed to fetch data.' }) => (
  <div className="failure-container">
    <img
      src="https://res.cloudinary.com/du8lwvfjj/image/upload/v1758367344/failure-image_uptjvf.svg"
      alt="Failed"
      className="failure-img"
    />
    <p className="status-message error">{message}</p>
  </div>
);

export default FailureView;