import React, { useState, useEffect } from 'react';
import AddProductForm from './AddProductForm';
import {
  fetchInventoryItems,
  updateInventoryItem,
  updateMenuItem,
} from '@/utils/api';

const InventoryTable = () => {
  const [userRole, setUserRole] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // State to control form visibility

  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const refreshProductList = async () => {
    console.log('Refreshing product list...');
    const updatedItems = await fetchInventoryItems();
    setInventoryItems(updatedItems);
  };

  useEffect(() => {
    const loadInventoryItems = async () => {
      try {
        const fetchedItems = await fetchInventoryItems();
        console.log('Fetched items:', fetchedItems); // Log to check data
        setInventoryItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
        // Handle error (show error message, etc.)
      }
    };

    loadInventoryItems();
  }, []);

  useEffect(() => {
    // Access localStorage only after the component has mounted
    const storedUserRole = localStorage.getItem('userRole');
    setUserRole(storedUserRole);
  }, []);

  // Function to adjust stock
  const adjustStock = async (itemId, adjustment) => {
    console.log('adjustStock called', itemId, adjustment); // Add this line
    const itemToUpdate = inventoryItems.find((item) => item.item_id === itemId);
    if (itemToUpdate) {
      const updatedCount = Math.max(itemToUpdate.current_count + adjustment, 0);

      try {
        await updateInventoryItem(itemToUpdate.inventory_id, {
          current_count: updatedCount,
        });
        const fetchedItems = await fetchInventoryItems();
        console.log('New Updated Fetched items:', fetchedItems); // Log to check data
        // Update local state after successful API call
        // const updatedItems = inventoryItems.map(item =>
        //   item.item_id === itemId ? { ...item, currentCount: updatedCount } : item
        // );
        setInventoryItems(fetchedItems);
      } catch (error) {
        console.error('Error updating inventory:', error);
        // Handle error (show error message, etc.)
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const isStockLow = (item) => {
    return item.currentCount < item.minimumRequired;
  };

  // Function to determine if the user can adjust stock
  const canAdjustStock = () => {
    if (!userRole) return false;
    // Define which roles are allowed to adjust stock
    const allowedRoles = ['manager', 'admin'];
    return allowedRoles.includes(userRole);
  };

  const handleAddClick = () => {
    setShowAddForm(true); // Show the form
  };

  /// EDITING START
  const [editingItemId, setEditingItemId] = useState(null); // ID of the item being edited
  const [editFormData, setEditFormData] = useState({}); // Data being edited

  const handleEditClick = (item) => {
    setEditingItemId(item.item_id);
    setEditFormData({ ...item });
  };

  const handleFinishEdit = async () => {
    try {
      // Update the inventory item in the database
      await updateInventoryItem(editingItemId, {
        current_count: editFormData.current_count,
        minimum_required: editFormData.minimum_required,
      });

      // Update the menu item in the database
      await updateMenuItem(editFormData.item_id, {
        item_name: editFormData.item_name,
        price: editFormData.price,
        category: editFormData.category,
        subcategory: editFormData.subcategory,
      });

      // Update local state with the new item data
      const updatedItems = inventoryItems.map((item) =>
        item.item_id === editingItemId ? { ...editFormData } : item
      );
      setInventoryItems(updatedItems);

      // Exit editing mode
      setEditingItemId(null);
    } catch (error) {
      console.error('Error updating item:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleCancelEdit = () => {
    // Reset edit form data (optional)
    setEditFormData({});

    // Exit editing mode
    setEditingItemId(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  //// EDITING FINISH

  ///// FILTER BEGIN
  const [filterSubcategory, setFilterSubcategory] = useState('All');
  const subcategoryMapping = {
    Ushqim: ['Pizza', 'Pasta', 'Hamburger'],
    Pije: ['Alkoolike', 'JoAlkoolike', 'Tea'],
    Dessert: ['Torte', 'Akullore', 'Puding'],
    // Add more categories and subcategories as needed
  };
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    // Update available subcategories based on selected category
    setAvailableSubcategories(subcategoryMapping[e.target.value] || []);
    setFilterSubcategory('All'); // Reset subcategory filter when category changes
  };

  const handleSubcategoryChange = (e) => {
    setFilterSubcategory(e.target.value);
  };

  const filteredItems = inventoryItems.filter((item) => {
    console.log('Item:', item); // Log each item
    const matchesCategory =
      filterCategory === 'All' || item.category === filterCategory;
    const matchesSubcategory =
      filterSubcategory === 'All' || item.subcategory === filterSubcategory;
    const matchesSearchTerm = item.item_name.toLowerCase().includes(searchTerm);

    console.log('Matches Category:', matchesCategory);
    console.log('Matches Subcategory:', matchesSubcategory);
    console.log('Matches Search Term:', matchesSearchTerm);

    return matchesCategory && matchesSubcategory && matchesSearchTerm;
  });

  const renderTableCell = (item, fieldName, type = 'text') => {
    const cellStyle = 'border border-gray-400 px-0 py-0'; // Common cell styling
    const inputStyle = 'border-0 w-full h-full text-center'; // Input styling to fill the cell

    // Check if the current cell is being edited
    const isEditingField = editingItemId === item.item_id;

    // Function to update subcategories when category changes
    const handleCategoryChangeInEdit = (e) => {
      // Update the category in the form data
      const updatedFormData = { ...editFormData, category: e.target.value };

      // Reset subcategory when category changes
      updatedFormData.subcategory = 'All';

      // Set the available subcategories based on the new category
      setEditFormData(updatedFormData);
    };

    // Handle selects for category and subcategory fields
    if (isEditingField) {
      if (fieldName === 'category') {
        const options = ['Ushqim', 'Pije', 'Dessert']; // Example categories
        return (
          <td className={cellStyle}>
            <select
              name={fieldName}
              value={editFormData[fieldName]}
              onChange={handleCategoryChangeInEdit} // Use the new handler here
              className="w-full h-full text-center rounded-md border-0"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </td>
        );
      } else if (fieldName === 'subcategory') {
        // Use the category from editFormData to determine the available subcategories
        const options = subcategoryMapping[editFormData.category] || [];
        return (
          <td className={cellStyle}>
            <select
              name={fieldName}
              value={editFormData[fieldName]}
              onChange={handleEditFormChange} // Keep using the existing form change handler
              className="w-full h-full text-center rounded-md border-0"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </td>
        );
      } else {
        // For other editable fields, render an input
        return (
          <td className={cellStyle}>
            <input
              type={type}
              name={fieldName}
              value={editFormData[fieldName]}
              onChange={handleEditFormChange}
              className={`${inputStyle}`}
              style={{
                maxWidth: '100%',
                padding: '0px',
                lineHeight: '1.5',
                boxSizing: 'border-box',
              }}
            />
          </td>
        );
      }
    }

    // For non-editable cells, display the text
    return (
      <td className={cellStyle}>
        <span className="block overflow-hidden overflow-ellipsis whitespace-nowrap">
          {item[fieldName]}
        </span>
      </td>
    );
  };

  ///// FILTER FINISH

  return (
    <>
      <div className="mb-4 flex justify-between">
        <div className="flex-grow mr-2">
          <input
            type="text"
            placeholder="Search items..."
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md "
          />
        </div>
        <div className="flex-grow mx-2">
          <select
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md "
          >
            <option value="All">All Categories</option>
            <option value="Ushqim">Ushqim</option>
            <option value="Pije">Pije</option>
            <option value="Dessert">Dessert</option>
          </select>
        </div>

        <div className="flex-grow mx-2">
          <select
            onChange={handleSubcategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md "
          >
            <option value="All">All Subcategories</option>
            {availableSubcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="table-container"
        style={{ height: '60vh', overflowY: 'auto' }}
      >
        <table className="border-collapse w-full" style={{ width: '135vh' }}>
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-400">Item Name</th>
              <th className="px-4 py-2 border border-gray-400">Category</th>
              <th className="px-4 py-2 border border-gray-400">Subcategory</th>
              <th className="px-4 py-2 border border-gray-400">
                Current Count
              </th>
              <th className="px-4 py-2 border border-gray-400">Price</th>
              <th className="px-4 py-2 border border-gray-400">
                Minimum Required
              </th>
              <th className="px-4 py-2 border border-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className={isStockLow(item) ? 'bg-red-100' : ''}
              >
                {renderTableCell(item, 'item_name')}
                {renderTableCell(item, 'category')}
                {renderTableCell(item, 'subcategory')}
                {renderTableCell(item, 'current_count', 'number')}
                {renderTableCell(item, 'minimum_required', 'number')}
                {renderTableCell(item, 'price', 'number')}

                <td className="border border-gray-400 px-4 py-2">
                  {editingItemId === item.item_id ? (
                    <>
                      <button
                        className="border border-1 pr-4"
                        onClick={handleFinishEdit}
                      >
                        Finish
                      </button>
                      <button
                        className="border border-1 pr-4"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="border border-1 pr-4"
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {userRole === 'admin' && (
        <button
          onClick={handleAddClick}
          className="bg-blue-500 text-white p-2 mb-1 mt-2 rounded"
        >
          Add New Product
        </button>
      )}
      {showAddForm ? (
        <AddProductForm
          refreshProductList={refreshProductList}
          setShowAddForm={setShowAddForm}
        />
      ) : (
        <div className="border-t border-gray-900"></div>
      )}
    </>
  );
};

export default InventoryTable;
