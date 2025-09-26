import React, { useState, useEffect } from 'react';
import './index.css';

const ImageUpload = ({ onImageUpload, existingImageUrl }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (existingImageUrl) {
      setPreview(existingImageUrl);
    }
  }, [existingImageUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file); 
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