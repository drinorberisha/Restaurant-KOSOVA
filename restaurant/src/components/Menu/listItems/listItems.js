import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function MenuItemDetail({
  category,
  subcategory,
  menuItems,
  onAddToOrder,
  searchInput,
}) {
  const [selectedType, setSelectedType] = useState(null);
  const userToTable = useSelector((state) => state.userTable);

  // useEffect(() => {
  //   setSelectedType(null);
  // }, [item]);
  const filteredItems = menuItems.filter(
    (item) => item.subcategory === subcategory
  );

  const handleSelectAndAddToOrder = (item) => {
    onAddToOrder(item);
  };
  return (
    <div className="h-[20%] flex flex-col">
      <div className="mb-1">
        {subcategory ? `${category}: ${subcategory}` : "All Items"}
      </div>
      <div
        className="flex flex-wrap gap-1.5 overflow-x-auto mb-1"
        style={{ flexGrow: 1 }}
      >
        {filteredItems.map((item) => (
          <div
            key={item.item_id}
            onClick={() => handleSelectAndAddToOrder(item)}
            className="min-w-[120px] max-w-full p-2 cursor-pointer border border-gray-300 transition-all duration-300 rounded text-center"
            style={{ height: "fit-content" }}
          >
            {item.item_name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuItemDetail;
