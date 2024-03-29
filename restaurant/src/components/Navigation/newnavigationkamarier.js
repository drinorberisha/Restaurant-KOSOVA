import React, { useState, useEffect } from "react";
import background from "../../../public/nav.jpeg";
import logo from "../../../public/logo123.jpg";
import NavbarPin from "./navPin";
import Tables from "../../../public/Tables.png"
import Inventory from "../../../public/Inventory.png";
import Link from "next/link";
import { useRouter } from "next/router";


const Nav = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('waiter');
  useEffect(() => {
    const active = localStorage.getItem("isActive");
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    setIsLoggedIn(!!active);
  }, []);


  const authenticatedNav = [
    { name: "Tavolina", href: "/", current: true, image: Tables },
    {
      name: "Magazina",
      href: "/magazina",
      current: false,
      image: Inventory,
    },
  ];
  const waiterNav = [
    { name: "Tavolina", href: "/", current: true, image: Tables },
    { name: "Pazari", href: "/", current: true, image: Tables },
   
  ];


//   const publicNav = [
//     { name: "Login", href: "/", current: true },
//     { name: "Register", href: "/register", current: false },
//   ];
//   const navigation = isLoggedIn ? authenticatedNav : publicNav;
     const navigation =  authenticatedNav
    const waiter  = waiterNav 


  navigation.forEach((item) => {
    item.current = item.href === router.pathname;
  });
  waiter.forEach((item) => {
    item.current = item.href === router.pathname;
  });
  const logoutFunc = () => {
    localStorage.setItem("isActive", false);
    localStorage.removeItem("userRole");
    router.push("/auth/login");
    window.location.reload();
  };

  return (

    <><nav className="relative flex justify-between items-center bg-gray-500 p-4 bg-[url('/nav.jpeg')]">
    <div className="absolute top-[80%] right-[30%] -translate-x-1/2 -translate-y-1/2 flex gap-5">
      {/* Navigation Pins */}
      
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
  </nav>
    {userRole == "waiter"? (waiterNav.map((item) => (
      <NavbarPin
        key={item.name}
        path={item.href}
        label={item.current}
        image={item.image}
      >
        {item.name}
      </NavbarPin>
    ))):(navigation.map((item) => (
      <NavbarPin
        key={item.name}
        path={item.href}
        label={item.current}
        image={item.image}
      >
        {item.name}
      </NavbarPin>
    )))}
      
    </>
  );
};

export default Nav;
