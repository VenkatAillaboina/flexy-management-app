import './index.css';

const HoardingDetailsPopup = ({ hoarding, onClose }) => {
  if (!hoarding) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>{hoarding.name}</h2>
        <img src={hoarding.imageUrl} alt={hoarding.name} className="popup-image" />
        <p><strong>Address:</strong> {hoarding.address}</p>
        <p><strong>Status:</strong> {hoarding.status}</p>
        <p><strong>Price:</strong> {hoarding.price ? `₹${hoarding.price}/month` : 'N/A'}</p>
        <p><strong>Dimensions:</strong> {hoarding.width && hoarding.height ? `${hoarding.width}ft x ${hoarding.height}ft` : 'N/A'}</p>
        <p><strong>Contact:</strong> {hoarding.ownerName} - {hoarding.ownerContactNumber}</p>
        <p><strong>Notes:</strong> {hoarding.notes}</p>
      </div>
    </div>
  );
};

export default HoardingDetailsPopup;