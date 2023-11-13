import React, { useState, useEffect } from "react";

function MenuItemDetail({ item, onAddToOrder }) {
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    setSelectedType(null);
  }, [item]);

  const typeItemStyle = {
    padding: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    border: "1px solid #ddd",
    borderRadius: "4px",
    height: "45px", // Adjust this value as needed

  };

  const typeItemSelectedStyle = {
    backgroundColor: "#eee",
    fontWeight: "bold",
  };

  const typeContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(min-content, 1fr))",
    gap: "6px",
    overflowY: "auto",
    alignItems: "start",
  };

  const handleSelectAndAddToOrder = (type) => {
    setSelectedType(type);
    onAddToOrder(type);
  };

  // Style for the container with a bottom border
  const containerStyle = {
    height: "25%",
    borderBottom: "1.5px solid #000",
  };

  return (
    <div style={containerStyle}>
      <div>{item ? item.name : "Menu Item"} types:</div>
      {item ? (
        <div style={typeContainerStyle}>
          {item.types.map((type) => (
            <div
              key={type.name}
              onClick={() => handleSelectAndAddToOrder(type)}
              style={{
                ...typeItemStyle,
                ...(selectedType && selectedType.name === type.name
                  ? typeItemSelectedStyle
                  : {}),
              }}
            >
              {type.name} - {type.price}
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
          }}
        >
          No menu item type results...
        </div>
      )}
    </div>
  );
}

export default MenuItemDetail;
