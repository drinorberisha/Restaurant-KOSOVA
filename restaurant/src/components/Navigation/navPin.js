import React from "react";
import Link from "next/link";
const NavbarPin = ({ children, image, label, path }) => {
  const styles = {
    quoteContainer: {
      marginTop: "20px",
      position: "relative",
    },
    note: {
      color: "#333",
      position: "relative",
      minWidth: "30%",
      height: "auto",
      margin: "0 auto 5px", // Reduced margin-bottom to bring text closer
      padding: "10px 20px", // Adjusted padding
      fontFamily: "Verdana",
      fontSize: "18px",
      boxShadow: "0 10px 10px 2px rgba(0,0,0,0.3)",
      background: "#eae672",
      transform: "rotate(2deg)",
      overflow: "hidden", // Hide overflowing content
      whiteSpace: "normal", // Allow text to break and wrap
      lineHeight: "1.4", // Adjust for better vertical alignment
      display: "flex", // Use flexbox for layout
      flexDirection: "column", // Stack items vertically
      alignItems: "center", // Center items horizontally
      justifyContent: "center",
    },
    pinBody: {
      backgroundColor: "#aaa",
      display: "block",
      height: "32px",
      width: "2px",
      position: "absolute",
      left: "50%",
      top: "-16px",
      zIndex: "1",
      transform: "rotate(15deg)",
      transformOrigin: "bottom center",
    },
    pinHead: {
      backgroundColor: "#A31",
      backgroundImage:
        "radial-gradient(25% 25%, circle, hsla(0,0%,100%,.3), hsla(0,0%,0%,.3))",
      borderRadius: "50%",
      height: "12px",
      left: "calc(50% + 3px)", // Centering the head relative to the body
      position: "absolute",
      top: "-22px", // Adjusted to position the pin head higher
      width: "12px",
      zIndex: "2",
      boxShadow: "none", // Removed the boxShadow
    },
    image: {
      width: "80px",
      height: "70px",
      display: "block",
      margin: "0 auto 2px", // Decreased margin-bottom for the image to bring the text closer
    },
    link: {
      textDecoration: "none",
    },
  };

  return (
    <Link href={path} style={styles.link}>
      <div style={styles.quoteContainer}>
        <div style={styles.pinBody}></div>
        <div style={styles.pinHead}></div>
        <blockquote style={styles.note}>
          <img src={image} alt="Table Icon" style={styles.image} />
          {children}
        </blockquote>
      </div>
    </Link>
  );
};

export default NavbarPin;
