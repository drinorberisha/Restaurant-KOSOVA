import React, { useState, useEffect } from "react";
import { fetchInventoryItems } from "@/utils/api";


function MenuList({ onSelectItem, onCategorySelect, onSubcategorySelect }) {
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wasUserSelected, setWasUserSelected] = useState(false);
  const [menuItems, setMenuItems] = useState([]);


  const [filterSubcategory, setFilterSubcategory] = useState('All');
  const [availableSubcategories, setAvailableSubcategories] = useState([]);



  const [uniqueSubcategories, setUniqueSubcategories] = useState([]);


  useEffect(() => {
    // Collect unique subcategories
    const subcategories = new Set();
    menuItems.forEach(item => {
      if (selectedCategory === 'All' || item.category === selectedCategory) {
        subcategories.add(item.subcategory);
      }
    });
    setUniqueSubcategories(Array.from(subcategories));
  }, [menuItems, selectedCategory]);



  const handleSubcategoryClick = (subcategory) => {
    setWasUserSelected(true);
    onSubcategorySelect(subcategory);
  };

  // Subcategory mapping
  const subcategoryMapping = {
    Ushqim: ['Pizza', 'Pasta', 'Hamburger'],
    Pije: ['Alkoolike', 'JoAlkoolike', 'Tea'],
    Dessert: ['Torte', 'Akullore', 'Puding']
  };



  const handleCategoryButtonClick = (category) => {
    setSelectedCategory(category);
    setWasUserSelected(false);
    setAvailableSubcategories(subcategoryMapping[category] || []);
    setFilterSubcategory('All'); // Reset subcategory filter when category changes
  };



  const handleSubcategoryChange = (subcategory) => {
    setFilterSubcategory(subcategory);
  };



  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setWasUserSelected(false);
  };
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSubcategory = filterSubcategory === 'All' || item.types.some(type => type.name === filterSubcategory);
    const matchesSearchTerm = item.name.toLowerCase().includes(searchInput.toLowerCase());
    return matchesCategory && matchesSubcategory && matchesSearchTerm;
  });

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const items = await fetchInventoryItems();
        console.log("before transformation data :", items);
        const myTransformedItems = transformData(items);
        console.log("After Transformation",myTransformedItems);
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
      icon: "🍽️", 
      category:item.category,
      subcategory:item.subcategory,
      price:item.price,
    }));
    console.log(transformedItems);
    return transformedItems;
  };


  // useEffect(() => {
  //   if (!wasUserSelected) {
  //     if (filteredMenuItems.length > 0) {
  //       onSelectItem(filteredMenuItems[0]);
  //     } else {
  //       onSelectItem(null);
  //     }
  //   }
  // }, [searchInput, onSelectItem, filteredMenuItems, wasUserSelected]);




  return (
    <div className="flex h-[37%]">
       <div className="flex flex-col space-y-2 p-2 border-l-2 border-b-2 border-black flex-grow-0">
        <button className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded-full" onClick={() => handleCategoryButtonClick('Ushqim')}>Ushqim</button>
        <button className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded-full" onClick={() => handleCategoryButtonClick('Pije')}>Pije</button>
        <button className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded-full" onClick={() => handleCategoryButtonClick('Dessert')}>Dessert</button>
      </div>
    <div className="border-b-2 border-black flex-grow">
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
      {uniqueSubcategories.length > 0 ? (
        <div className="grid grid-cols-5 gap-1.5 overflow-y-auto align-start h-3/4">
            {uniqueSubcategories.map((subcategory) => (
              <div
                key={subcategory}
                onClick={() => handleSubcategoryClick(subcategory)}
                className="p-2 cursor-pointer border border-gray-300 transition-all duration-300 rounded whitespace-nowrap overflow-hidden text-ellipsis h-14">
                <span>🍽️</span> {subcategory}
              </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          No subcategories available ...
        </div>
      )}
    </div>
    </div>
  );
}

export default MenuList;