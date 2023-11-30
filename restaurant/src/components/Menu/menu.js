import React, {useEffect, useState} from "react";
import MenuList from "./menuList/menuList";
import MenuItemDetail from "./listItems/listItems";
import OrderSummary from "./orderSummary/orderSummary";
import { fetchInventoryItems, orderCreate, fetchUnpaidItems, updateTableStatus} from "@/utils/api";
import { useSelector , useDispatch} from 'react-redux';
import { updateTableTotals } from "../../../store/features/tableTotalsSlice";

const Menu = ({ selectedTable, refreshTables}) => {
  const updateTotals = (updatedTotals) => {
    dispatch(updateTableTotals(updatedTotals));
  };
  const dispatch = useDispatch();
console.log(selectedTable);


const [priceBeforeOrderCreated, setPriceBeforeOrderCreated] = useState();
const [errorMessage, setErrorMessage] = useState('');
const [successMessage, setSuccessMessage] = useState('');




  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState({});

  const tableTotals = useSelector(state => state.tableTotals);

  // const [tables, setTables] = useState(
  //   new Array(16).fill(null).map((_, index) => ({
  //     table_id: index + 1,
  //     table_number: index + 1,
  //     status: "free",
  //     current_order_id: null
  //   }))
  // );

  const [unpaidItemsDetails, setUnpaidItemsDetails] = useState([]);

  const refreshUnpaidItems = async () => {
    try {
      const unpaidOrders = await fetchUnpaidItems(selectedTable);
      const updatedUnpaidItemsDetails = unpaidOrders.map(order => {
        const itemDetail = menuItems.find(item => item.item_id === order.itemId);
        console.log("itemdetail in refresh",itemDetail);
        return {
          ...order,
          name: itemDetail?.item_name,
          price: itemDetail?.price
        };
      });
  
      setUnpaidItemsDetails(updatedUnpaidItemsDetails);
    } catch (error) {
      console.error("Error refreshing unpaid items:", error);
    }
  };





  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const items = await fetchInventoryItems();
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
  
    loadMenuItems();
  }, []);



  useEffect(() => {
    const loadUnpaidItems = async () => {
      if (selectedTable) {
        try {
          const itemsWithQuantities = await fetchUnpaidItems(selectedTable);
          console.log("Items with quantities:", itemsWithQuantities);
  
          const itemsDetails = itemsWithQuantities.map(({ itemId, quantity }) => {
            const itemDetails = menuItems.find(item => item.item_id === itemId);
            return { ...itemDetails,name: itemDetails?.item_name, quantity };
          });
  
          console.log("Items details including quantities:", itemsDetails);
          setUnpaidItemsDetails(itemsDetails);
        } catch (error) {
          console.error('Error fetching unpaid items for table:', selectedTable, error);
        }
      }
    };
  
    loadUnpaidItems();
  }, [selectedTable, menuItems]);

  console.log(orderItems);
 



  // useEffect(() => {
  //   const initializeTables = async () => {
  //     try {
  //       const tableData = await fetchAllTables();
  //       setTables(tableData);
  //     } catch (error) {
  //       console.error('Error fetching tables:', error);
  //     }
  //   };

  //   initializeTables();

  //   // const loadMenuItems = async () => {
  //   //   try {
  //   //     const items = await fetchInventoryItems();
  //   //     setMenuItems(items);
  //   //   } catch (error) {
  //   //     console.error('Error fetching menu items:', error);
  //   //   }
  //   // };

  //   // loadMenuItems();
  // }, []);



  const getCategoryFromSubcategory = (subcategory) => {
    const item = menuItems.find(item => item.subcategory === subcategory);
    return item ? item.category : 'All';
  };


  const userToTable = useSelector(state => state.userTable);

  const onAddToOrder = (item) => {
   
 console.log("THIS IS USER TO TABLE", userToTable);
  // Check if the current user is allowed to modify the order
  const userId = parseInt(localStorage.getItem("userId"));
  const tableUserId = userToTable[selectedTable]?.user_id;

  console.log(`Current User ID: ${userId} (type: ${typeof userId}), Table User ID: ${tableUserId} (type: ${typeof tableUserId}), Selected Table: ${selectedTable}`);

  // Check if the current user is allowed to modify the order
  if (tableUserId && userId !== tableUserId) {
    console.error("You are not authorized to modify this order.");
    setErrorMessage("Nuk jeni te lejuar te shtoni ne kete tavoline!");
    setTimeout(() => setErrorMessage(''), 3000); // Hide after 5 seconds
    return; // Exit the function if not authorized
  }
    setOrderItems(prevItems => {
      const tableId = selectedTable;
      const updatedItems = { ...prevItems };
  
      if (!updatedItems[tableId]) {
        updatedItems[tableId] = {};
      }
  
      const currentQuantity = updatedItems[tableId][item.item_id]?.quantity || 0;
      updatedItems[tableId][item.item_id] = {
        name: item.item_name,
        item_id: item.item_id,
        price: item.price,
        quantity: currentQuantity + 1
      };
      
      const newTotal = Object.values(updatedItems[tableId]).reduce(
        (sum, currItem) => sum + (currItem.price * currItem.quantity),
        0
      );
      setPriceBeforeOrderCreated(newTotal);
      // const existingTotal = tableTotals[tableId] || 0;

      // if(tableTotals[tableId] !== 0){
      //   updateTotals({ ...tableTotals, [tableId]: existingTotal + newTotal });
      //   }else{
        updateTotals({ ...tableTotals, [tableId]: newTotal });
      //   }
      
  
      
      return updatedItems;
    });
  };

  
  const onIncrement = (itemId) => {

    const userId = parseInt(localStorage.getItem("userId"));
    const tableUserId = userToTable[selectedTable]?.user_id;
  
    console.log(`Current User ID: ${userId} (type: ${typeof userId}), Table User ID: ${tableUserId} (type: ${typeof tableUserId}), Selected Table: ${selectedTable}`);
  
    // Check if the current user is allowed to modify the order
    if (tableUserId && userId !== tableUserId) {
      console.error("You are not authorized to modify this order.");
      setErrorMessage("Nuk jeni te lejuar te shtoni ne kete tavoline!");
      setTimeout(() => setErrorMessage(''), 3000); // Hide after 5 seconds
      return; // Exit the function if not authorized
    }
    setOrderItems(prevItems => {
      const updatedItems = { ...prevItems };
      const tableId = selectedTable;
  
      if (updatedItems[tableId] && updatedItems[tableId][itemId]) {
        updatedItems[tableId][itemId].quantity += 1;
  
        // Update total price here
      
        const newTotal = calculateTotalPrice(orderItems[tableId]);
        console.log("Selected Table:", selectedTable);
        console.log("Order Items for Selected Table:", orderItems[selectedTable]);
        console.log("the calculation of total:",newTotal)
        updateTotals({ ...tableTotals, [tableId]: newTotal });
        };
      
    
      return updatedItems;
    });
  };
  
  const onDecrement = (itemId) => {

   const userId = parseInt(localStorage.getItem("userId"));
  const tableUserId = userToTable[selectedTable]?.user_id;

  console.log(`Current User ID: ${userId} (type: ${typeof userId}), Table User ID: ${tableUserId} (type: ${typeof tableUserId}), Selected Table: ${selectedTable}`);

  // Check if the current user is allowed to modify the order
  if (tableUserId && userId !== tableUserId) {
      console.error("You are not authorized to modify this order.");
      setErrorMessage("Nuk jeni te lejuar te shtoni ne kete tavoline!");
      setTimeout(() => setErrorMessage(''), 3000); // Hide after 5 seconds
      return; // Exit the function if not authorized
    }
    console.log("itemId from onDecrement function", itemId);
    setOrderItems(prevItems => {
      const updatedItems = { ...prevItems };
      const tableId = selectedTable;
  
      if (updatedItems[tableId] && updatedItems[tableId][itemId] && updatedItems[tableId][itemId].quantity > 1) {
        updatedItems[tableId][itemId].quantity -= 1;
        
        // Update total price here
        const updatedTotal = calculateTotalPrice(updatedItems[selectedTable]);
        updateTotals({ ...tableTotals, [selectedTable]: updatedTotal });
      }
     
      return updatedItems;
    });
  };
  
  

  
  const onDelete = (itemId) => {
   
    const userId = parseInt(localStorage.getItem("userId"));
  const tableUserId = userToTable[selectedTable]?.user_id;

  console.log(`Current User ID: ${userId} (type: ${typeof userId}), Table User ID: ${tableUserId} (type: ${typeof tableUserId}), Selected Table: ${selectedTable}`);

  // Check if the current user is allowed to modify the order
  if (tableUserId && userId !== tableUserId) {
      console.error("You are not authorized to modify this order.");
      setErrorMessage("Nuk jeni te lejuar te shtoni ne kete tavoline!");
      setTimeout(() => setErrorMessage(''), 3000); // Hide after 5 seconds
      return; // Exit the function if not authorized
    }
    setOrderItems(prevItems => {
      const updatedItems = { ...prevItems };
      const tableId = selectedTable;
  
      if (updatedItems[tableId] && updatedItems[tableId][itemId]) {
        delete updatedItems[tableId][itemId];
  
        // Update total price here
        const updatedTotal = calculateTotalPrice(updatedItems[tableId]);
        updateTotals({ ...tableTotals, [tableId]: updatedTotal });
      }
     
      return updatedItems;
    });
  };
  
  
  const calculateTotalPrice = (items) => {
    if (!items) {
      // If items is undefined or null, return 0
      return 0;
    }
  
    return Object.values(items).reduce((total, item) => {
      if (item && item.price && item.quantity) {
        return total + item.price * item.quantity;
      } else {
        return total;
      }
    }, 0);
  };
const [checkOrderItems, setCheckOrderItems] = useState([]);

  const createOrder = async (tableNumber) => {
    const currentTotalPrice = tableTotals[tableNumber] || 0; 
    const userId = parseInt(localStorage.getItem("userId"));
    const tableId = selectedTable;

    if (!tableNumber) {
      console.error('Table ID not found for the selected table number');
      return;
    }

    // Extract item_ids from orderItems for the selected table
    const itemsData = orderItems[tableNumber] ? 
    Object.entries(orderItems[tableNumber]).map(([itemId, itemDetails]) => ({
        itemId: parseInt(itemId),
        quantity: itemDetails.quantity
    })) : [];

    try {
      console.log("current total price before api call", currentTotalPrice);
      // Modify the API call to include itemIds
  
      const response = await orderCreate(tableNumber, currentTotalPrice, itemsData, userId);
      console.log('Order created:', response);
      await refreshUnpaidItems();
      console.log("unpaidItemsDetails:",unpaidItemsDetails);
      await updateTableStatus(selectedTable, 'busy');
      setErrorMessage(''); // Clear any previous error messages

      setOrderItems(prevItems => {
        const updatedItems = { ...prevItems };
        const newTotal = Object.values(updatedItems[tableId]).reduce(
          (sum, currItem) => sum + (currItem.price * currItem.quantity),
          0 
        );
        
        const existingTotal = tableTotals[tableId] ;
        updateTotals({ ...tableTotals, [tableId]:newTotal });
        delete updatedItems[tableNumber];
        return updatedItems;
      });
      await refreshTables();

      setSuccessMessage("Porosia eshte shtypur me sukses");
      setTimeout(() => setSuccessMessage(''), 2000); 
      // Display success message or handle UI updates
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response && error.response.status === 403) {
        setErrorMessage(error.response.data.message);
        setTimeout(() => setErrorMessage(''), 3000); // Hide after 5 seconds
      } else {
        setErrorMessage("An error occurred while processing your request.");
        setTimeout(() => setErrorMessage(''), 3000); // Hide after 5 seconds
      }
    }
};


  
  // const getTableIdFromNumber = (tableNumber) => {
  //   const table = tables.find(t => t.table_number === tableNumber);
  //   return table ? table.table_id : null;
  // };
  console.log("FROM menu.js: selectedTable",selectedTable);




  const resetTableTotal = (tableId) => {
    console.log(`Resetting total for table ${tableId}`);
    updateTotals({ ...tableTotals, [tableId]: 0 });
  };
  
  //START  SEARCH INPUT
  const [searchInput, setSearchInput] = useState('');
  const [autoSelectedSubcategory, setAutoSelectedSubcategory] = useState(null);
  const handleMenuSearchChange = (input) => {
    setSearchInput(input);

    // Determine the subcategory based on the search input
    const filteredItems = menuItems.filter(item => 
      item.item_name.toLowerCase().includes(input.toLowerCase())
    );
    const uniqueSubcategories = new Set(filteredItems.map(item => item.subcategory));

    if (uniqueSubcategories.size === 1) {
      setAutoSelectedSubcategory([...uniqueSubcategories][0]);
    } else {
      setAutoSelectedSubcategory(null);
    }
  };

// END SEARCH INPUT

  return (
    <div className="bg-gray-100 p-2.5 rounded-md h-full flex flex-col">
      <div>
    {errorMessage && <div className="error-message">{errorMessage}</div>}
  </div>
  <div>
    {successMessage && <div className="success-message">{successMessage}</div>}
  </div>
      <MenuList onSubcategorySelect={setSelectedSubcategory} category={getCategoryFromSubcategory(selectedSubcategory)} onSearchInputChange={handleMenuSearchChange} searchInput={searchInput}   setSearchInput={setSearchInput}/>
      <div className="border-t border-gray-900"></div>{" "}
      <MenuItemDetail 
      searchInput={searchInput} 
      category={getCategoryFromSubcategory(selectedSubcategory)}  
      subcategory={selectedSubcategory || autoSelectedSubcategory }  
      menuItems={menuItems} 
      onAddToOrder={(item, userToTable)=> onAddToOrder(item, userToTable)} />
      <div className="border-t border-gray-900"></div>{" "}
      <OrderSummary
        orderItems={orderItems[selectedTable] || []} // Pass only the current table's orders 
        unpaidItemsDetails={unpaidItemsDetails}
        onIncrement={(item, userToTable) => onIncrement(item, userToTable)}
        onDecrement={(item, userToTable) => onDecrement(item, userToTable)}
        onDelete={(item, userToTable) => onDelete(item, userToTable)}
        totalPrice={tableTotals[selectedTable]}   
        onCreateOrder={() => createOrder(selectedTable)}
        selectedTable={selectedTable}
        refreshUnpaidItems={refreshUnpaidItems}
        onResetTableTotals={() => resetTableTotal(selectedTable)}
        refreshTables={refreshTables}
        />
    </div>
  );
};

export default Menu;
