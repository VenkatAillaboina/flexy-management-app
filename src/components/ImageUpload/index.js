import React, { useState } from 'react';
import './index.css';

const ImageUpload = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageUpload(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload-container">
      <input
        type="file"
        accept="image/*"
        capture="environment" // Prioritizes camera on mobile
        onChange={handleImageChange}
      />
      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Upload Preview" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;