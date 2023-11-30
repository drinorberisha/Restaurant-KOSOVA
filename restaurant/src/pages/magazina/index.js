import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './MagazinaPage.module.css';
import Nav from '@/components/Navigation/nav';
import InventoryTable from '@/components/InventoryTable/InventoryTable';
import UserManagementTable from '@/components/UserManagementTable/UserManagementTable';

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
    if (role !== 'manager' && role !== 'admin') {
      router.push('/');
    }
  }, [router]);

  return (
    <>
      <Nav />
      <div
        className={
          styles.background + ' flex justify-center items-center h-screen'
        }
      >
        <div className="flex flex-col">
          {userRole === 'admin' && (
            <div className="mb-2 mt-5">
              <button
                onClick={handleProductManagementClick}
                className="bg-blue-500 text-white p-2 mr-3 rounded"
              >
                Manage Products
              </button>
              <button
                onClick={handleUserManagementClick}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Manage Users
              </button>
            </div>
          )}
          <div className="bg-white p-8 rounded">
            {currentView === 'products' ? (
              <InventoryTable />
            ) : (
              <UserManagementTable />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Magazina;
