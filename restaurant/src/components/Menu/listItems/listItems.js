import React, { useState, useEffect } from "react";

function MenuItemDetail({ item, onAddToOrder }) {
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    setSelectedType(null);
  }, [item]);

  const handleSelectAndAddToOrder = (type) => {
    setSelectedType(type);
    onAddToOrder(type);
  };

  return (
    <div className="h-2/7 border-b-2 border-black flex-grow">
      <div>{item ? item.name : "Menu Item"} types:</div>
      {item ? (
        <div className="grid grid-cols-5 gap-1.5 overflow-y-auto align-start mb-1">
          {item.types.map((type) => (
            <div
              key={type.name}
              onClick={() => handleSelectAndAddToOrder(type)}
              className={`p-1 cursor-pointer border border-gray-300 transition-all duration-300 rounded h-11 ${selectedType && selectedType.name === type.name ? "bg-gray-200 font-bold" : ""}`}
            >
              {type.name} - {type.price}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          No menu item type results...
        </div>
      )}
    </div>
  );
}

export default MenuItemDetail;
