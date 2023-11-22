import React,{useEffect, useState} from "react";
import { useRouter } from "next/router";
import styles from './MagazinaPage.module.css';
import Nav from "@/components/Navigation/nav";
import InventoryTable from "@/components/InventoryTable/InventoryTable";
import UserManagementTable from "@/components/UserManagementTable/UserManagementTable";

const Magazina = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  const [currentView, setCurrentView] = useState('products'); 

  const handleUserManagementClick = () => {
    setCurrentView('users');
  };

  const handleProductManagementClick = () => {
    setCurrentView('products');
  };


  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    // Redirect if not authorized
    if (role !== 'manager' && role !== 'admin') {
      router.push('/'); // Redirect to a different page
    }
  }, [router]);

  return (
    <>
        <Nav />
        <div className={styles.background + " flex-grow"}>
        <div className="flex flex-col h-screen">
        <div className={`${styles.matrix} relative w-full h-full my-[5%] mx-[5%]`}>


    {userRole === 'admin' && (
      <div>
        <button onClick={handleProductManagementClick} className="bg-blue-500 text-white p-2 mr-3 rounded">
          Manage Products
        </button>
        <button onClick={handleUserManagementClick} className="bg-blue-500 text-white p-2 mr-3 rounded">
          Manage Users
        </button>
      </div>
    )}

{currentView === 'products' ? (  
            <InventoryTable/>
    
   ):(
      <UserManagementTable/>
      
    )}
            </div>
      </div>
   </div>
    </>
  );
};

export default Magazina;
