// AddProductForm.js

import React, { useState } from 'react';
import { ToastContainer, toast, toastContainer } from 'react-toastify';
import { AddProduct } from '@/utils/api';
import { data } from 'autoprefixer';

const AddProductForm = ({ setShowAddForm, refreshProductList }) => {
  const subcategoryMapping = {
    Ushqim: ['Pizza', 'Pasta', 'Hamburger'],
    Pije: ['Alkoolike', 'JoAlkoolike', 'Tea'],
    Dessert: ['Torte', 'Akullore', 'Puding'],
    // Add more categories and subcategories as needed
  };
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

    const role = localStorage.getItem('userRole');
    const dataWithRole = { ...formData, role };

    try {
      console.log(dataWithRole);
      await AddProduct(dataWithRole);
      setShowAddForm(false);

      refreshProductList();
      console.log('Submitting new product...');
      // toast.message("Success, you added a new product!")
    } catch (error) {
      console.error('Error adding product:', error);
      // toast.error("Error adding product"); // Display error toast
      // Handle error (show error message, etc.)
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  return (
    <>
      <ToastContainer />
      <div className="modal-background">
        <div className="modal-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="text-center border border-black"
              name="item_name"
              value={formData.item_name}
              onChange={handleInputChange}
              placeholder="Product Name"
              required
            />
            <input
              type="text"
              className="text-center border border-black"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Category"
              required
            />
            {/* <select name="category"onChange={handleInputChange}>
            
            <option>Zgjedhe 1 kategori</option>
            <option value="Ushqim">Ushqim</option>
            <option value="Pije">Pije</option>
            <option value="Dessert">Dessert</option>
        </select> */}
            {/* <select onChange={handleSubcategoryChange}>
         <option value="All">Zgjedhe 1 subkategori</option>
         {availableSubcategories.map(subcategory => (
          <option key={subcategory} value={subcategory}>{subcategory}</option>
          ))}
    </select> */}
            <input
              type="text"
              className="text-center border border-black"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              placeholder="Subcategory"
            />
            <input
              type="number"
              className="text-center border border-black"
              name="current_count"
              value={formData.current_count}
              onChange={handleInputChange}
              placeholder="Current Count"
              min="0"
              required
            />
            <input
              type="number"
              className="text-center border border-black"
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
              className="text-center border border-black"
              name="minimum_required"
              value={formData.minimum_required}
              onChange={handleInputChange}
              placeholder="Minimum Required"
              min="0"
              required
            />

            <button
              className="rounded-full bg-blue-500 text-white mr-1 ml-1 mb-1 px-2 py-1 "
              type="submit"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full bg-red-500 text-white mb-1 px-2 py-1 "
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProductForm;
