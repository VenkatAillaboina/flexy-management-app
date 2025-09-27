import React, {useState, useEffect, useRef } from 'react';
import { FaCamera, FaTimes } from 'react-icons/fa';
import './index.css';

const ImageUpload = ({ onImageUpload, existingImageUrl, onImageRemove }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageRemove();
    // Reset the file input so the user can re-upload the same file if they want
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="image-upload-container">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      {!preview && (
        <button type="button" className="camera-btn" onClick={handleCameraClick}>
          <FaCamera />
          <span>Upload/Capture</span>
        </button>
      )}
      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Upload Preview" />
          <button type="button" className="remove-btn" onClick={handleRemoveImage}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;