import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../ImageUpload';
import LoadingView from '../LoadingView';
import FailureView from '../FailureView';
import axios from 'axios';
import './index.css';

const API_URL = 'http://localhost:8080';

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILURE: 'failure',
};

const FlexyForm = ({ existingFlexy, pinnedLocation }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    width: '',
    height: '',
    price: '',
    status: 'Available',
    ownerContactNumber: '',
    ownerName: '',
    notes: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(STATUS.IDLE);

  useEffect(() => {
    if (existingFlexy) {
      setFormData({
        name: existingFlexy.name || '',
        address: existingFlexy.address || '',
        width: existingFlexy.width || '',
        height: existingFlexy.height || '',
        price: existingFlexy.price || '',
        status: existingFlexy.status || 'Available',
        ownerContactNumber: existingFlexy.ownerContactNumber || '',
        ownerName: existingFlexy.ownerName || '',
        notes: existingFlexy.notes || '',
        image: null,
      });
    }
  }, [existingFlexy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (file) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!pinnedLocation) newErrors.location = 'A location must be pinned on the map.';
    if (!formData.image && !existingFlexy) newErrors.image = 'An image is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fix the errors before submitting.");
      return;
    }

    setSubmitStatus(STATUS.LOADING);
    
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
        if (key === 'image' && formData.image) {
            submissionData.append('image', formData.image);
        } else if (key !== 'image' && formData[key]) {
             submissionData.append(key, formData[key]);
        }
    });

    if (pinnedLocation) {
        submissionData.append('coordinates', [pinnedLocation.lng, pinnedLocation.lat].join(','));
    }

    try {
      if (existingFlexy) {
        await axios.patch(`${API_URL}/hoardings/${existingFlexy._id}`, submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Flexy updated successfully!');
      } else {
        await axios.post(`${API_URL}/hoardings`, submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Flexy added successfully!');
      }
      setSubmitStatus(STATUS.SUCCESS);
      navigate('/notes');
    } catch (error) {
      console.error('Submission failed:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || 'Could not submit flexy.'}`);
      setSubmitStatus(STATUS.FAILURE);
    }
  };
  
  if (submitStatus === STATUS.LOADING) {
    return <LoadingView />;
  }
  
  if (submitStatus === STATUS.FAILURE) {
    return <FailureView message="Submission Failed. Please try again." />;
  }

  return (
    <form className="flexy-form" onSubmit={handleSubmit} noValidate>
      <h2>{existingFlexy ? 'Edit Flexy Details' : 'Add New Flexy'}</h2>
      
      <div className="form-group">
        <label>Upload Picture</label>
        <ImageUpload
          onImageUpload={handleImageUpload}
          existingImageUrl={existingFlexy ? existingFlexy.imageUrl : null}
        />
        {errors.image && <p className="error-text">{errors.image}</p>}
      </div>
      
      <div className="form-group">
        <label>Flexy Name / Title</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label>Location (GPS Coordinates)</label>
        <input 
          type="text" 
          name="location" 
          value={pinnedLocation ? `${pinnedLocation.lat.toFixed(6)}, ${pinnedLocation.lng.toFixed(6)}` : ''} 
          readOnly 
          placeholder="Click map to select location"
        />
        {errors.location && <p className="error-text">{errors.location}</p>}
      </div>
      
      <div className="form-group">
        <label>Address / Landmark</label>
        <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
        {errors.address && <p className="error-text">{errors.address}</p>}
      </div>
      
      <div className="form-group">
        <label>Dimensions (Width x Height in feet) - Optional</label>
        <div className="dimension-group">
          <input type="number" name="width" value={formData.width} onChange={handleChange} placeholder="Width" />
          <span>x</span>
          <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Height" />
        </div>
      </div>
      
      <div className="form-group">
        <label>Availability Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option>Available</option>
          <option>Occupied</option>
          <option>Reserved</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Price / Rent (per month)</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} />
      </div>
      
      <div className="form-group">
        <label>Owner Name</label>
        <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Owner / Agency Contact</label>
        <input type="text" name="ownerContactNumber" value={formData.ownerContactNumber} onChange={handleChange} />
      </div>
      
      <div className="form-group">
        <label>Notes / Description</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
      </div>
      
      <button type="submit" className="submit-btn" disabled={submitStatus === STATUS.LOADING}>
        {submitStatus === STATUS.LOADING ? 'Submitting...' : (existingFlexy ? 'Update Flexy' : 'Add Flexy')}
      </button>
    </form>
  );
};

export default FlexyForm;