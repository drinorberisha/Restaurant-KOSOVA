import React , {useState, useEffect} from 'react';
import AddProductForm from './AddProductForm';
import { fetchInventoryItems } from '@/utils/api';

const InventoryTable = () => {
  const [userRole, setUserRole] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // State to control form visibility

  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');




  useEffect(() => {
    const loadInventoryItems = async () => {
      try {
        const fetchedItems = await fetchInventoryItems();
        console.log("Fetched items:", fetchedItems); // Log to check data
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
  // const initialInventoryItems = [
  //   { id: 1, itemName: 'Margarita', category: 'Food', subcategory: 'Pizza', currentCount: 20, minimumRequired: 5 },
  //   { id: 2, itemName: 'Diavolo', category: 'Food', subcategory: 'Pizza', currentCount: 15, minimumRequired: 5 },
  //   { id: 3, itemName: 'Coke', category: 'Drinks', subcategory: 'Soft Drinks', currentCount: 30, minimumRequired: 10 },
  //   { id: 4, itemName: 'Cheesecake', category: 'Desserts', subcategory: 'Cake', currentCount: 15, minimumRequired: 5 },
  
  // ];

  // Function to adjust stock
  const adjustStock = (itemId, adjustment) => {
    const updatedItems = inventoryItems.map(item => {
      if (item.id === itemId) {
        // Prevent stock from going negative
        const updatedCount = Math.max(item.currentCount + adjustment, 0);
        return { ...item, currentCount: updatedCount };
      }
      return item;
    });
    setInventoryItems(updatedItems);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const filteredItems = inventoryItems.filter(item => {
    return (
      item.itemName && 
      (filterCategory === 'All' || item.category === filterCategory) &&
      item.itemName.toLowerCase().includes(searchTerm)
    );
  });
  const isStockLow = (item) => {
    return item.currentCount < item.minimumRequired;
  };



  // Function to determine if the user can adjust stock
  const canAdjustStock = () => {
    if (!userRole) return false;
    // Define which roles are allowed to adjust stock
    const allowedRoles = ["manager", "admin"];
    return allowedRoles.includes(userRole);
  };



  const handleAddClick = () => {
    setShowAddForm(true); // Show the form
  };
  return (
    <>
     <div className="mb-4">
        <input
          type="text"
          placeholder="Search items..."
          onChange={handleSearchChange}
          className="mr-2"
        />
        <select onChange={handleCategoryChange}>
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Drinks">Drinks</option>
          <option value="Desserts">Desserts</option>
          {/* Add more categories as needed */}
        </select>
        <button></button>
      </div>
    <table className="min-w-full table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Item Name</th>
          <th className="px-4 py-2 border">Category</th>
          <th className="px-4 py-2 border">Subcategory</th>
          <th className="px-4 py-2 border">Current Count</th>
          <th className="px-4 py-2 border">Minimum Required</th>
          <th className="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {inventoryItems.map(item => (
            <tr key={item.id} className={isStockLow(item) ? "bg-red-100" : ""}>
            <td className="border px-4 py-2">{item.item_name}</td>
            <td className="border px-4 py-2">{item.category}</td>
            <td className="border px-4 py-2">{item.subcategory}</td>
            <td className="border px-4 py-2">{item.current_count}</td>
            <td className="border px-4 py-2">{item.price}</td>

            <td className="border px-4 py-2">{item.minimum_required}</td>
            <td className="border px-4 py-2 ">
            {canAdjustStock() && (
                  <>
              <button className="border border-black mr-4"onClick={() => adjustStock(item.id, 1)}>+</button>
              <button className="border border-black "onClick={() => adjustStock(item.id, -1)}>-</button>
              </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {userRole === 'admin' && (
        <button onClick={handleAddClick} className="bg-blue-500 text-white p-2 rounded">
          Add New Product
        </button>
      )}

      {showAddForm && <AddProductForm setShowAddForm={setShowAddForm} />}
    </>
  );
};

export default InventoryTable;
