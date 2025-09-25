import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../ImageUpload';
import './index.css';

const FlexyForm = ({ onFormSubmit, existingFlexy, pinnedLocation }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', location: '', address: '', width: '', height: '',
    type: 'Hoarding', status: 'Available', price: '', ownerContact: '',
    image: null, notes: '',
  });

  useEffect(() => {
    if (existingFlexy) {
      setFormData(existingFlexy);
    }
  }, [existingFlexy]);

  // This new useEffect updates the form when the map is clicked
  useEffect(() => {
    if (pinnedLocation) {
      const { lat, lng } = pinnedLocation;
      setFormData(prev => ({ ...prev, location: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
    }
  }, [pinnedLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageData) => {
    setFormData((prev) => ({ ...prev, image: imageData }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
    if (!existingFlexy) {
      setFormData({
        name: '', location: '', address: '', width: '', height: '',
        type: 'Hoarding', status: 'Available', price: '', ownerContact: '',
        image: null, notes: '',
      });
    } else {
      navigate(`/notes/${existingFlexy.id}`);
    }
  };

  return (
    <form className="flexy-form" onSubmit={handleSubmit}>
       <h2>{existingFlexy ? 'Edit Flexy Details' : 'Add New Flexy'}</h2>
      
      <label>Flexy Name / Title</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      
      <label>Location (GPS Coordinates)</label>
      <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Click map or enter manually" />
      
      <label>Address / Landmark</label>
      <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
      
      <label>Dimensions (Width x Height in feet)</label>
      <div className="dimension-group">
        <input type="number" name="width" value={formData.width} onChange={handleChange} placeholder="Width" />
        <span>x</span>
        <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Height" />
      </div>
      
      <label>Type</label>
      <select name="type" value={formData.type} onChange={handleChange}>
        <option>Hoarding</option>
        <option>Banner</option>
        <option>Digital Screen</option>
        <option>Pole Kiosk</option>
        <option>Wall Wrap</option>
      </select>
      
      <label>Availability Status</label>
      <select name="status" value={formData.status} onChange={handleChange}>
        <option>Available</option>
        <option>Occupied</option>
        <option>Reserved</option>
      </select>
      
      <label>Price / Rent (per month)</label>
      <input type="number" name="price" value={formData.price} onChange={handleChange} />
      
      <label>Owner / Agency Contact</label>
      <input type="text" name="ownerContact" value={formData.ownerContact} onChange={handleChange} />
      
      <label>Upload Picture</label>
      <ImageUpload onImageUpload={handleImageUpload} />
      
      <label>Notes / Description</label>
      <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
      
      <button type="submit" className="submit-btn">
        {existingFlexy ? 'Update Flexy' : 'Add Flexy'}
      </button>
    </form>
  );
};

export default FlexyForm;