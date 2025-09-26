import React, { useState } from 'react';
import './index.css';

const ImageUpload = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Pass the raw file object to the parent form
      onImageUpload(file); 
      
      // Generate a preview URL from the file object
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="image-upload-container">
      <input
        type="file"
        accept="image/*"
        capture="environment"
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