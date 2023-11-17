import React , {useState, useEffect} from 'react';

const InventoryTable = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Access localStorage only after the component has mounted
    const storedUserRole = localStorage.getItem('userRole');
    setUserRole(storedUserRole);
  }, []);
  const initialInventoryItems = [
    { id: 1, itemName: 'Margarita', category: 'Food', subcategory: 'Pizza', currentCount: 20, minimumRequired: 5 },
    { id: 2, itemName: 'Diavolo', category: 'Food', subcategory: 'Pizza', currentCount: 15, minimumRequired: 5 },
    { id: 3, itemName: 'Coke', category: 'Drinks', subcategory: 'Soft Drinks', currentCount: 30, minimumRequired: 10 },
    { id: 4, itemName: 'Cheesecake', category: 'Desserts', subcategory: 'Cake', currentCount: 15, minimumRequired: 5 },
    // More items...
  ];
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
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
    const allowedRoles = ["Manager", "Owner"];
    return allowedRoles.includes(userRole);
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
            <td className="border px-4 py-2">{item.itemName}</td>
            <td className="border px-4 py-2">{item.category}</td>
            <td className="border px-4 py-2">{item.subcategory}</td>
            <td className="border px-4 py-2">{item.currentCount}</td>
            <td className="border px-4 py-2">{item.minimumRequired}</td>
            <td className="border px-4 py-2 ">
            {canAdjustStock() && (
                  <>
              <button className="border border-black mr-2"onClick={() => adjustStock(item.id, 1)}>+</button>
              <button onClick={() => adjustStock(item.id, -1)}>-</button>
              </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
};

export default InventoryTable;
