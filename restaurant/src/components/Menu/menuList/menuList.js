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

  const searchBarStyle = {
    width: "100%",
    padding: "10px",
    paddingInlineEnd: "40px",
    fontSize: "16px",
    boxSizing: "border-box",
  };

  const menuItemStyle = {
    padding: "8px",
    cursor: "pointer",
    border: "1px solid #ddd",
    transition: "background-color 0.3s",
    borderRadius: "4px",
    whiteSpace: "nowrap", // Prevents text wrapping
    overflow: "hidden", // Keeps the content within the div
    textOverflow: "ellipsis", // Adds an ellipsis if the text is too long
    height: "59px", // Adjust this value as needed
  };

  const menuItemSelectedStyle = {
    backgroundColor: "#eee",
    fontWeight: "bold",
  };

  const menuContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(min-content, 1fr))",
    gap: "6px",
    overflowY: "auto",
    alignItems: "start",
    height: "75%",
  };

  const containerStyle = {
    height: "35%",
    borderBottom: "1.5px solid #000",
  };

  return (
    <div style={containerStyle}>
      <div style={{ position: "relative", marginBottom: "10px",height:"25%" }}>
        <input
          style={searchBarStyle}
          placeholder="Search menu..."
          value={searchInput}
          onChange={handleSearchChange}
        />
        <button
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          🔍
        </button>
      </div>
      {filteredMenuItems.length > 0 ? (
        <div style={menuContainerStyle}>
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setWasUserSelected(true);
                onSelectItem(item);
              }}
              style={{
                ...menuItemStyle,
                ...(selectedItem && selectedItem.id === item.id
                  ? menuItemSelectedStyle
                  : {}),
              }}
            >
              <span>{item.icon}</span> {item.name}
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
          }}
        >
          No menu item results...
        </div>
      )}
    </div>
  );
}

export default MenuList;
