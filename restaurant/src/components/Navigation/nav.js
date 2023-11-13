import React, { useState, useEffect } from "react";
import background from "../../../public/nav.jpeg";
import logo from "../../../public/logo123.jpg";
import NavbarPin from "./navPin";
import tableImage from "../../../public/Tables.png";
import inventoryImage from "../../../public/Inventory.png";
import Link from "next/link";
import { useRouter } from "next/router";
const styles = {
  nav: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "gray",
    backgroundImage: `url('${background}')`,
    padding: "17px 20px",
  },
  logo: {
    position:"absolute",
    left:"50%",
    display: "flex",
    fontWeight: "bold",
    fontSize: "20px",
    alignItems:"center",

  },
  profileSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  navbarContainer: {
    position: "absolute",
    top: "120%", // Move to the center vertically
    right: "28%", // Move to the center horizontally
    transform: "translate(-50%, -50%)", // Adjust for its own dimensions
    display: "flex",
    gap: "20px",
  },
  profilePic: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "white",
  },
  dateinfo:{
    display:"flex",
    position:"relative",
    left:"40%",
    width:"300px",
    color:"white",
  },
};

const Nav = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const active = localStorage.getItem("isActive");
    setIsLoggedIn(!!active);
  }, []);


  const authenticatedNav = [
    { name: "Tavolina", href: "/", current: true, image: tableImage },
    {
      name: "Magazina",
      href: "/magazina",
      current: false,
      image: inventoryImage,
    },
  ];

  const publicNav = [
    { name: "Login", href: "/", current: true },
    { name: "Register", href: "/register", current: false },
  ];
//   const navigation = isLoggedIn ? authenticatedNav : publicNav;
     const navigation =  authenticatedNav


  navigation.forEach((item) => {
    item.current = item.href === router.pathname;
  });
  const logoutFunc = () => {
    localStorage.setItem("isActive", false);
    localStorage.removeItem("userRole");
    router.push("/");
    window.location.reload();
  };

  return (
    <>
      <div className="relative flex justify-between items-center bg-gray-500 p-4 bg-[url('/nav.jpeg')]">
  <div className="absolute top-[120%] right-[28%] -translate-x-1/2 -translate-y-1/2 flex gap-5">
    {/* Navigation Pins */}
    {navigation.map((item) => (
      <NavbarPin
        key={item.name}
        path={item.href}
        label={item.current}
        image={item.image}
      >
        {item.name}
      </NavbarPin>
    ))}
  </div>
  <div className="flex relative left-40 w-72 text-white">
    <p>Ora, data</p>
  </div>
  
  <div className="flex items-center gap-2.5">
    <div className="w-10 h-10 rounded-full bg-white"></div>
    {isLoggedIn && <button onClick={logoutFunc}>Logout</button>}
    {!isLoggedIn && (
      <Link href="/auth/login">
        Login
      </Link>
    )}
  </div>
</div>
    </>
  );
};

export default Nav;
