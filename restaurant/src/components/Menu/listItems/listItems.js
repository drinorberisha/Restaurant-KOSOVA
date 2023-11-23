import React, { useState, useEffect } from "react";

function MenuItemDetail({ category, subcategory, menuItems, onAddToOrder }) {
  const [selectedType, setSelectedType] = useState(null);

  // useEffect(() => {
  //   setSelectedType(null);
  // }, [item]);

  const handleSelectAndAddToOrder = (item) => {
    onAddToOrder(item);
  };
  const filteredItems = menuItems.filter(item => item.subcategory === subcategory);
  return (
    <div className="h-[23%] ">
    {subcategory ? (
      <div>
        <div>{category}:{subcategory} </div>
        <div className="grid grid-cols-5 gap-1.5 overflow-y-auto align-start mb-1">
          {filteredItems.map((item) => (
            <div
              key={item.item_id}
              onClick={() => handleSelectAndAddToOrder(item)}
              className="p-1 cursor-pointer border border-gray-300 transition-all duration-300 rounded h-11">
              {item.item_name} - {item.price}€
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="text-center">Select a subcategory...</div>
    )}
  </div>
);
}

export default MenuItemDetail;
