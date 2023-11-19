// AddProductForm.js

import React, { useState } from 'react';
import {ToastContainer, toast, toastContainer} from  'react-toastify';
import { AddProduct } from '@/utils/api';
import { data } from 'autoprefixer';

const AddProductForm = ({ setShowAddForm }) => {

  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    subcategory: '',
    current_count: 0,
    minimum_required: 0,
    price: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const role = localStorage.getItem("userRole");
    const dataWithRole = { ...formData, role };

    try {
      console.log(dataWithRole);
      await AddProduct(dataWithRole);
      setShowAddForm(false);
      // toast.message("Success, you added a new product!")

    } catch (error) {
      console.error('Error adding product:', error);
      // toast.error("Error adding product"); // Display error toast
      // Handle error (show error message, etc.)
    }
  };

  const handleCancel = () => {
    setShowAddForm(false); // Close form without adding
  };

  return (
    <>
    <ToastContainer/>
    <div className="modal-background">
      <div className="modal-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="item_name"
            value={formData.item_name}
            onChange={handleInputChange}
            placeholder="Product Name"
            required
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Category"
            required
          />
          <input
            type="text"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleInputChange}
            placeholder="Subcategory"
          />
          <input
            type="number"
            name="current_count"
            value={formData.current_count}
            onChange={handleInputChange}
            placeholder="Current Count"
            min="0"
            required
          />
             <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price"
            min="0"
            step="0.01"
            required
          />
          <input
            type="number"
            name="minimum_required"
            value={formData.minimum_required}
            onChange={handleInputChange}
            placeholder="Minimum Required"
            min="0"
            required
          />
       
          <button type="submit">Add Product</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      </div>
    </div>
    </>
  );
};

export default AddProductForm;