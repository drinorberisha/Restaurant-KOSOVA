import React, { useState, useEffect } from "react";
import { fetchInventoryItems } from "@/utils/api";

function MenuList({
  onSelectItem,
  onCategorySelect,
  onSubcategorySelect,
  category,
  onSearchInputChange,
  searchInput,
  setSearchInput,
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wasUserSelected, setWasUserSelected] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const [filterSubcategory, setFilterSubcategory] = useState("All");
  const [uniqueSubcategories, setUniqueSubcategories] = useState([]);

  // SEARCH INPUT
  const handleSearchChange = (e) => {
    onSearchInputChange(e.target.value);
    setWasUserSelected(false);

    // Additional logic for auto-selecting subcategory, if applicable
  };

  // END SEARCH INPUT

  useEffect(() => {
    // Collect unique subcategories
    const subcategories = new Set();
    menuItems.forEach((item) => {
      if (selectedCategory === "All" || item.category === selectedCategory) {
        subcategories.add(item.subcategory);
      }
    });
    setUniqueSubcategories(Array.from(subcategories));
  }, [menuItems, selectedCategory]);

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const handleSubcategoryClick = (subcategory) => {
    setSearchInput("");
    setSelectedSubcategory(subcategory);
    setWasUserSelected(true);
    onSubcategorySelect(subcategory);
  };

  // const handleSearchChange = (e) => {
  //   setSearchInput(e.target.value);
  //   setWasUserSelected(false);
  // };

  // Subcategory mapping
  const subcategoryMapping = {
    All: [
      "Pizza",
      "Pasta",
      "Hamburger",
      "Alkoolike",
      "JoAlkoolike",
      "Tea",
      "Torte",
      "Akullore",
      "Puding",
    ],
    Ushqim: ["Pizza", "Pasta", "Hamburger"],
    Pije: ["Alkoolike", "JoAlkoolike", "Tea"],
    Dessert: ["Torte", "Akullore", "Puding"],
  };

  const handleCategoryButtonClick = (category) => {
    setSelectedCategory(category);
    setWasUserSelected(false);
    setUniqueSubcategories(subcategoryMapping[category] || []);
    setFilterSubcategory("All");
    setSelectedSubcategory("");
  };

  const handleSubcategoryChange = (subcategory) => {
    setFilterSubcategory(subcategory);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSubcategory =
      filterSubcategory === "All" ||
      item.types.some((type) => type.name === filterSubcategory);
    const matchesSearchTerm = item.name
      .toLowerCase()
      .includes(searchInput.toLowerCase());
    return matchesCategory && matchesSubcategory && matchesSearchTerm;
  });

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const items = await fetchInventoryItems();
        console.log("before transformation data :", items);
        const myTransformedItems = transformData(items);
        console.log("After Transformation", myTransformedItems);
        setMenuItems(myTransformedItems);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    loadMenuItems();
  }, []);

  const transformData = (fetchedItems) => {
    // Example transformation logic (adjust as needed)
    const transformedItems = fetchedItems.map((item) => ({
      id: item.item_id,
      name: item.item_name,
      icon: "🍽️",
      category: item.category,
      subcategory: item.subcategory,
      price: item.price,
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
  const handleClear = () => {
    // Clear search input
    onSearchInputChange("");
    // Clear selected subcategory
    onSubcategorySelect("");
    setSelectedCategory("All");
    setSelectedSubcategory("");
    setUniqueSubcategories(subcategoryMapping["All"]);
  };

  return (
    <div className="flex flex-col h-[37%]">
      <div className="relative mb-0 h-1/5">
        <input
          className="w-full p-2.5 text-lg box-border"
          placeholder="Search menu..."
          value={searchInput}
          onChange={handleSearchChange}
        />
        <button className="absolute right-2.5 top-[40%] transform -translate-y-1/2 text-2xl bg-transparent border-none cursor-pointer">
          🔍
        </button>
      </div>
      <div className="flex flex-row flex-grow">
        <div
          className="flex flex-col justify-between overflow-y-auto space-y-2 p-2 flex-grow-0"
          style={{ maxHeight: "calc(100% - 3.5rem)" }}
        >
          <button
            className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded-full"
            onClick={() => handleCategoryButtonClick("All")}
          >
            All
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded-full"
            onClick={() => handleCategoryButtonClick("Ushqim")}
          >
            Ushqim
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded-full"
            onClick={() => handleCategoryButtonClick("Pije")}
          >
            Pije
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded-full"
            onClick={() => handleCategoryButtonClick("Dessert")}
          >
            Dessert
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded-full"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
        <div className="flex flex-col flex-grow">
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100% - 3.5rem)" }}
          >
            {uniqueSubcategories.length > 0 ? (
              <div className="grid grid-cols-5 gap-1.5 p-2">
                {uniqueSubcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => handleSubcategoryClick(subcategory)}
                    className={`p-2 cursor-pointer border border-gray-300 transition-all duration-300 rounded whitespace-nowrap overflow-hidden text-ellipsis ${
                      selectedSubcategory === subcategory ? "bg-gray-200" : ""
                    }`}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center p-2">
                No subcategories available ...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuList;
