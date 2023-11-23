import React, { useState, useEffect } from "react";
import AddProductForm from "./AddProductForm";
import {
  fetchInventoryItems,
  updateInventoryItem,
  updateMenuItem,
} from "@/utils/api";
import chai from "chai";

const InventoryTable = () => {
  const [userRole, setUserRole] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // State to control form visibility

  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    const loadInventoryItems = async () => {
      try {
        const fetchedItems = await fetchInventoryItems();
        console.log("Fetched items:", fetchedItems); // Log to check data
        setInventoryItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        // Handle error (show error message, etc.)
      }
    };

    loadInventoryItems();
  }, []);

  useEffect(() => {
    // Access localStorage only after the component has mounted
    const storedUserRole = localStorage.getItem("userRole");
    setUserRole(storedUserRole);
  }, []);

  // Function to adjust stock
  const adjustStock = async (itemId, adjustment) => {
    console.log("adjustStock called", itemId, adjustment); // Add this line
    const itemToUpdate = inventoryItems.find((item) => item.item_id === itemId);
    if (itemToUpdate) {
      const updatedCount = Math.max(itemToUpdate.current_count + adjustment, 0);

      try {
        await updateInventoryItem(itemToUpdate.inventory_id, {
          current_count: updatedCount,
        });
        const fetchedItems = await fetchInventoryItems();
        console.log("New Updated Fetched items:", fetchedItems); // Log to check data
        // Update local state after successful API call
        // const updatedItems = inventoryItems.map(item =>
        //   item.item_id === itemId ? { ...item, currentCount: updatedCount } : item
        // );
        setInventoryItems(fetchedItems);
      } catch (error) {
        console.error("Error updating inventory:", error);
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
    const allowedRoles = ["manager", "admin"];
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
      console.error("Error updating item:", error);
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
  const [filterSubcategory, setFilterSubcategory] = useState("All");
  const subcategoryMapping = {
    Ushqim: ["Pizza", "Pasta", "Hamburger"],
    Pije: ["Alkoolike", "JoAlkoolike", "Tea"],
    Dessert: ["Torte", "Akullore", "Puding"],
    // Add more categories and subcategories as needed
  };
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    // Update available subcategories based on selected category
    setAvailableSubcategories(subcategoryMapping[e.target.value] || []);
    setFilterSubcategory("All"); // Reset subcategory filter when category changes
  };

  const handleSubcategoryChange = (e) => {
    setFilterSubcategory(e.target.value);
  };

  const filteredItems = inventoryItems.filter((item) => {
    console.log("Item:", item); // Log each item
    const matchesCategory =
      filterCategory === "All" || item.category === filterCategory;
    const matchesSubcategory =
      filterSubcategory === "All" || item.subcategory === filterSubcategory;
    const matchesSearchTerm = item.item_name.toLowerCase().includes(searchTerm);

    console.log("Matches Category:", matchesCategory);
    console.log("Matches Subcategory:", matchesSubcategory);
    console.log("Matches Search Term:", matchesSearchTerm);

    return matchesCategory && matchesSubcategory && matchesSearchTerm;
  });

  // const renderTableCell = (item, fieldName, type = "text") => {
  //   const commonClasses = "border px-4 py-2"; // Common classes for all table cells
  //   const widthClass = "w-32"; // Width class for inputs and cells

  //   let content =
  //     editingItemId === item.item_id ? (
  //       <input
  //         className={`${widthClass} p-1`}
  //         type={type}
  //         name={fieldName}
  //         value={editFormData[fieldName]}
  //         onChange={handleEditFormChange}
  //       />
  //     ) : (
  //       <span className={widthClass}>{item[fieldName]}</span>
  //     );

  //   if (
  //     fieldName === "current_count" &&
  //     canAdjustStock() &&
  //     editingItemId !== item.item_id
  //   ) {
  //     content = (
  //       <div className="flex items-center justify-between">
  //         <span className={widthClass}>{item[fieldName]}</span>
  //         <div>
  //           <button
  //             className="border mx-1 p-1"
  //             onClick={() => adjustStock(item.item_id, 1)}
  //           >
  //             +
  //           </button>
  //           <button
  //             className="border mx-1 p-1"
  //             onClick={() => adjustStock(item.item_id, -1)}
  //           >
  //             -
  //           </button>
  //         </div>
  //       </div>
  //     );
  //   }

  //   return <td className={`${commonClasses} ${widthClass}`}>{content}</td>;
  // };

  const renderTableCell = (item, fieldName, type = "text") => {
    let content =
      editingItemId === item.item_id ? (
        <input
          type={type}
          name={fieldName}
          value={editFormData[fieldName]}
          onChange={handleEditFormChange}
        />
      ) : (
        <span>{item[fieldName]}</span>
      );

    if (
      fieldName === "current_count" &&
      canAdjustStock() &&
      editingItemId !== item.item_id
    ) {
      content = (
        <div className="flex justify-between items-center">
          {content}
          <div>
            <button
              className="border border-1 mx-1 p-1"
              onClick={() => adjustStock(item.item_id, 1)}
            >
              +
            </button>
            <button
              className="border border-1 mx-1 p-1"
              onClick={() => adjustStock(item.item_id, -1)}
            >
              -
            </button>
          </div>
        </div>
      );
    }

    return <td className="border px-4 py-2">{content}</td>;
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
            className="w-full"
          />
        </div>
        <div className="flex-grow mx-2">
          <select onChange={handleCategoryChange}>
            <option value="All">All Categories</option>
            <option value="Ushqim">Ushqim</option>
            <option value="Pije">Pije</option>
            <option value="Dessert">Dessert</option>
          </select>
        </div>

        <div className="flex-grow mx-2">
          <select onChange={handleSubcategoryChange}>
            <option value="All">All Subcategories</option>
            {availableSubcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>
      </div>
      <table className="min-w-[85vw] min-h-[55vh] table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Item Name</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Subcategory</th>
            <th className="px-4 py-2 border">Current Count</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Minimum Required</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id} className={isStockLow(item) ? "bg-red-100" : ""}>
              {renderTableCell(item, "item_name")}
              {renderTableCell(item, "category")}
              {renderTableCell(item, "subcategory")}
              {renderTableCell(item, "current_count", "number")}
              {renderTableCell(item, "minimum_required", "number")}
              {renderTableCell(item, "price", "number")}

              <td className="border px-4 py-2">
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

      {userRole === "admin" && (
        <button
          onClick={handleAddClick}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add New Product
        </button>
      )}

      {showAddForm && <AddProductForm setShowAddForm={setShowAddForm} />}
    </>
  );
};

export default InventoryTable;
