import React, { useState, useEffect } from "react";
import { useSelector} from 'react-redux';

function MenuItemDetail({ category, subcategory, menuItems, onAddToOrder , searchInput}) {
  const [selectedType, setSelectedType] = useState(null);
  const userToTable = useSelector(state => state.userTable);

  // useEffect(() => {
  //   setSelectedType(null);
  // }, [item]);
  const filteredItems = menuItems.filter(item => item.subcategory === subcategory)



  const handleSelectAndAddToOrder = (item) => {
    onAddToOrder(item);
  };
  return (
    <div className="h-[23%] flex flex-col">
        <div className="mb-1">{subcategory ? `${category}: ${subcategory}` : 'All Items'}</div> 
        <div className="grid grid-cols-5 gap-1.5 overflow-y-auto  align-start mb-1" style={{flex:1}}>
          {filteredItems.map((item) => (
            <div
              key={item.item_id}
              onClick={() => handleSelectAndAddToOrder(item)}
              className="p-1 cursor-pointer border border-gray-300 transition-all duration-300 rounded h-11">
              {item.item_name} 
            </div>
          ))}
        </div>
    </div>
   
);
}

export default MenuItemDetail;
