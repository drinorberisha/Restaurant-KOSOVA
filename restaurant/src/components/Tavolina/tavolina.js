import React from "react";
import tableImage from "../../../public/Tables.png";
import backgroundImage from "../../../public/bg2.jpg";

function Tables({ selectedTable, onSelectTable }) {
  const tables = new Array(16).fill({});

  const inputStyle = {
    padding: "0px 10px",
    borderRadius: "25px",
    border: "1px solid #ccc",
    marginRight: "10px",
    height: "28px",
    textAlign: "center",
    color: "black",
  };

  const searchBarStyle = {
    width: "99%", // Full width of its parent container
    padding: "10px",
    paddingInlineEnd: "40px", // Space for the search icon
    fontSize: "16px",
    boxSizing: "border-box",
    borderRadius: "25px",
    border: "1px solid #ccc",
    height: "28px", // Increased height for better visual
    color: "black",
    textAlign: "left", // Text aligned to the left
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        marginTop: "9.1%",

      }}
    >
      {/* White Header with rounded top */}
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "white", // So that it blends with the image if needed
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            placeholder="table number..."
            style={searchBarStyle}
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

        <select style={inputStyle}>
          <option value="all">Placement: All</option>
          <option value="outside">Placement: Outside</option>
          <option value="inside">Placement: Inside</option>
        </select>

        <select style={inputStyle}>
          <option value="all">Waiter: All</option>
          <option value="bob">Waiter: Bob</option>
          <option value="mike">Waiter: Mike</option>
        </select>

        <select style={inputStyle}>
          <option value="all">Status: All</option>
          <option value="free">Status: Free</option>
          <option value="occupied">Status: Occupied</option>
        </select>
      </div>

      {/* Transparent container for tables */}
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          padding: "10px 20px",
          overflowY: "auto", // Makes only this section scrollable
          maxHeight: "calc(100% - [height of header + height of footer])", // Adjust as per your header and footer height
        }}
      >
        {tables.map((table, index) => (
          <div
            key={index}
            style={{
              textAlign: "center",
              color: index === selectedTable ? "black" : "white",
              border: index === selectedTable ? "2px solid #b2b2b2" : "none", // highlight selected table
              backgroundColor:
                index === selectedTable ? "#b2b2b2" : "transparent",
              borderRadius: "10px",
              padding: "5px",
            }}
            onClick={() => onSelectTable(index)}
          >
            <img
              src={tableImage}
              alt="Table"
              style={{
                width: "75px",
                height: "75px",
                borderRadius: "50%",
              }}
            />
            <div>Table {index + 1} - 3€</div>
            <div>Waiter Name</div>
          </div>
        ))}
      </div>

      {/* White Footer with rounded bottom */}
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "white", // So that it blends with the image if needed
          padding: "10px 20px",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      >
        {/* Insert footer content here */}
      </div>
    </div>
  );
}

export default Tables;
