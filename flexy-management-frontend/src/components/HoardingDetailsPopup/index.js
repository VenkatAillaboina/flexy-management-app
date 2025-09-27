import './index.css';

const HoardingDetailsPopup = ({ hoarding, onClose }) => {
  if (!hoarding) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>{hoarding.name || 'N/A'}</h2>
        <img src={hoarding.imageUrl} alt={hoarding.name || 'Hoarding'} className="popup-image" />
        <p><strong>Address:</strong> {hoarding.address || 'N/A'}</p>
        <p><strong>Status:</strong> {hoarding.status || 'N/A'}</p>
        <p><strong>Price:</strong> {hoarding.price ? `₹${hoarding.price}/month` : 'N/A'}</p>
        <p><strong>Dimensions:</strong> {hoarding.width && hoarding.height ? `${hoarding.width}ft x ${hoarding.height}ft` : 'N/A'}</p>
        <p><strong>Contact:</strong> {hoarding.ownerName || 'N/A'} - {hoarding.ownerContactNumber || 'N/A'}</p>
        <p><strong>Notes:</strong> {hoarding.notes || 'N/A'}</p>
      </div>
    </div>
  );
};

export default HoardingDetailsPopup;