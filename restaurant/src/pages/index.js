// pages/index.js

import React, { useState, useEffect } from "react";
import  {menuItems} from "../components/Menu/items";
import Tables from "../components/Tavolina/tavolina";
import Nav from "../components/Navigation/nav";
import Menu from "../components/Menu/menu";
import { fetchAllTables , getUserByTableId} from "@/utils/api";
import { useSelector, useDispatch } from 'react-redux';
import { updateTableTotals } from "../../store/features/tableTotalsSlice";
import { setUserTableMapping } from "../../store/features/userTableSlice";
import { setTables } from "../../store/features/tableSlice";

function Home() {
  const [selectedItem, setSelectedItem] = useState(menuItems[0]);
  const initialOrders = new Array(16).fill([]).map(() => []);
  const [orderSummaries, setOrderSummaries] = useState(initialOrders);

  const [selectedTable, setSelectedTable] = useState(1);

  // const [newTableTotals, setNewTableTotals] = useState({});
  const dispatch = useDispatch();
  const myTables = useSelector(state => state.myTables.tables);


  const handleTableTotalsChange = (updatedTotals) => {
    dispatch(updateTableTotals(updatedTotals));
  };
  const newTableTotals = useSelector((state) => state.tableTotals);



    const handleSelectTable = (tableNumber) => {
  
      setSelectedTable(tableNumber);
    };
 

    // const handleTableTotalsChange = (newTableTotals) => {
    //   setTableTotals(newTableTotals);
    // };






    const refreshTables = async () => {
      try {
        console.log("Refreshing tables...");
        const fetchedTables = await fetchAllTables();
        console.log("Fetched tables:", fetchedTables);
        dispatch(setTables(fetchedTables));
        } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };
  
    useEffect(() => {
      refreshTables();
    }, []);


    const getBusyTables = () => {
      return myTables.filter(table => table.status === 'busy').map(table => table.table_id);
    };


    const [userToTable, setUserToTable] = useState({});

    const updateUserToTableMapping = async () => {
      const busyTableIds = getBusyTables();
      const newUserToTable = {};
    
      for (const tableId of busyTableIds) {
        try {
          const user = await fetchUserForTable(tableId);
          console.log("user after fetching it",user);
          newUserToTable[tableId] = user;
        } catch (error) {
          console.error(`Error fetching user for table ${tableId}:`, error);
        }
      }
    
      console.log("New user to table mapping for busy tables:", newUserToTable);
      dispatch(setUserTableMapping(newUserToTable));
        };
    
    useEffect(() => {
      if (myTables && myTables.length > 0) {
        console.log("Updating user to table mapping for busy tables...");
        updateUserToTableMapping();
      }
    }, [myTables]);

    const fetchUserForTable = async (tableId) => {
      try {
        // Update the API call to fetch the complete user object
        const response = await getUserByTableId(tableId);
        console.log("This is the response of the getUserByTableId function", response);
        if (response.message === "No active orders or user found for this table") {
          return { userId: null, username: 'Free' };
        }
        return response;
      } catch (error) {
        console.error('Error fetching user for table:', error);
        return null;
      }
    };

  return (
    <div className="min-h-screen min-w-full bg-cover bg-no-repeat bg-center bg-login-view overflow-hidden">
      <Nav />
      <div className="grid grid-cols-2 gap-5 p-2.5 max-h-full">
        <div className="h-full">
          <Menu
            selectedTable={selectedTable}
            refreshTables={refreshTables}
            userToTable={userToTable}

          />
        </div>
        <div className="rounded-lg h-full">
          <Tables
            selectedTable={selectedTable}
            onSelectTable={handleSelectTable}
            userToTable={userToTable}
            
          />
        </div>
      </div>
    </div>
  );
}

export default Home;

