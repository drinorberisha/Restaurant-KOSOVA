import React, { useState, useEffect } from "react";
import { fetchInventoryItems } from "@/utils/api";

function MenuList({ onSelectItem, selectedItem }) {

  const [searchInput, setSearchInput] = useState("");
  const [wasUserSelected, setWasUserSelected] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setWasUserSelected(false);
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchInput.toLowerCase())
    // Update this logic based on how your data structure is
  );



  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const items = await fetchInventoryItems();
        const myTransformedItems = transformData(items);
        console.log(myTransformedItems);
        setMenuItems(myTransformedItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    loadMenuItems();
  }, []);



  const transformData = (fetchedItems) => {
    // Example transformation logic (adjust as needed)
    const transformedItems = fetchedItems.map(item => ({
      id: item.item_id,
      name: item.item_name,
      icon: "🍽️", // Default icon, change as needed
      types: [
        {
          name: item.subcategory,
          price: `${item.price}€`
        }
      ]
    }));
    console.log(transformedItems);
    return transformedItems;
  };


  useEffect(() => {
    if (!wasUserSelected) {
      if (filteredMenuItems.length > 0) {
        onSelectItem(filteredMenuItems[0]);
      } else {
        onSelectItem(null);
      }
    }
  }, [searchInput, onSelectItem, filteredMenuItems, wasUserSelected]);


  return (
    <div className="h-[37%] border-b-2 border-black ">
      <div className="relative mb-0 h-1/5">
        <input
          className="w-full p-2.5 text-lg box-border"
          placeholder="Search menu..."
          value={searchInput}
          onChange={handleSearchChange}
        />
        <button
          className="absolute right-2.5 top-[40%] transform -translate-y-1/2 text-2xl bg-transparent border-none cursor-pointer"
        >
          🔍
        </button>
      </div>
      {filteredMenuItems.length > 0 ? (
        <div className="grid grid-cols-5 gap-1.5 overflow-y-auto align-start h-3/4">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setWasUserSelected(true);
                onSelectItem(item);
              }}
              className={`p-2 cursor-pointer border border-gray-300 transition-all duration-300 rounded whitespace-nowrap overflow-hidden text-ellipsis h-14 ${selectedItem && selectedItem.id === item.id ? "bg-gray-200 font-bold" : ""}`}
            >
              <span>{item.icon}</span> {item.name}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          No menu item results...
        </div>
      )}
    </div>
  );
}

export default MenuList;