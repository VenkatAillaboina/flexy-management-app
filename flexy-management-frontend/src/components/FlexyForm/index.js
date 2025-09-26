import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../ImageUpload';
import axios from 'axios';
import './index.css';

const API_URL = 'http://localhost:8080';

const FlexyForm = ({ existingFlexy, pinnedLocation }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    width: '',
    height: '',
    price: '',
    status: 'Available',
    ownerContact: '',
    notes: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingFlexy) {
      setFormData(existingFlexy);
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
    if (!formData.name.trim()) newErrors.name = 'Flexy Name is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!pinnedLocation) newErrors.location = 'A location must be pinned on the map.';
    if (!formData.image && !existingFlexy) newErrors.image = 'An image is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addFlexy = async (submissionData) => {
    try {
      const response = await axios.post(`${API_URL}/hoardings`, submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Flexy added successfully!');
      navigate('/notes'); // Redirect to the notes list after successful submission
    } catch (error) {
      console.error('Error adding flexy:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || 'Could not add flexy.'}`);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fix the errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    
    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('address', formData.address);
    submissionData.append('status', formData.status);
    submissionData.append('ownerContact', formData.ownerContact);
    submissionData.append('notes', formData.notes);
    
    if (formData.width) submissionData.append('width', formData.width);
    if (formData.height) submissionData.append('height', formData.height);
    if (formData.price) submissionData.append('price', formData.price);

    if (pinnedLocation) {
      const coordinates = [pinnedLocation.lng, pinnedLocation.lat];
      submissionData.append('coordinates', coordinates.join(','));
    }

    if (formData.image) {
      submissionData.append('image', formData.image);
    }

    try {
      if (existingFlexy) {
        // Here you would call an update function, e.g., updateFlexy(submissionData)
        // For now, it will still call addFlexy for demonstration
        await addFlexy(submissionData);
      } else {
        await addFlexy(submissionData);
      }
      
      setFormData({
        name: '', address: '', width: '', height: '',
        price: '', status: 'Available', ownerContact: '',
        notes: '', image: null,
      });

    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flexy-form" onSubmit={handleSubmit} noValidate>
      <h2>{existingFlexy ? 'Edit Flexy Details' : 'Add New Flexy'}</h2>
      
      <div className="form-group">
        <label>Flexy Name / Title</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
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
        <label>Owner / Agency Contact</label>
        <input type="text" name="ownerContact" value={formData.ownerContact} onChange={handleChange} />
      </div>
      
      <div className="form-group">
        <label>Upload Picture</label>
        <ImageUpload onImageUpload={handleImageUpload} />
        {errors.image && <p className="error-text">{errors.image}</p>}
      </div>
      
      <div className="form-group">
        <label>Notes / Description</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
      </div>
      
      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : (existingFlexy ? 'Update Flexy' : 'Add Flexy')}
      </button>
    </form>
  );
};

export default FlexyForm;