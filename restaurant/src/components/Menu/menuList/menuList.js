import React, { useState, useEffect } from "react";
import { menuItems } from "../items";

function MenuList({ onSelectItem, selectedItem }) {
  const [searchInput, setSearchInput] = useState("");
  const [wasUserSelected, setWasUserSelected] = useState(false);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setWasUserSelected(false);
  };

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.types.some((type) =>
        type.name.toLowerCase().includes(searchInput.toLowerCase())
      )
  );

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
    <div className="h-1/3 border-b-2 border-black flex-grow-0">
      <div className="relative mb-2.5 h-1/5">
        <input
          className="w-full p-2.5 text-lg box-border"
          placeholder="Search menu..."
          value={searchInput}
          onChange={handleSearchChange}
        />
        <button
          className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-2xl bg-transparent border-none cursor-pointer"
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