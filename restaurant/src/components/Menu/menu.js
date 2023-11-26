import React, {useEffect, useState} from "react";
import MenuList from "./menuList/menuList";
import MenuItemDetail from "./listItems/listItems";
import OrderSummary from "./orderSummary/orderSummary";
import { fetchInventoryItems, fetchAllTables, orderCreate, fetchUnpaidItems, updateTableStatus} from "@/utils/api";
import { useSelector , useDispatch} from 'react-redux';
import { updateTableTotals } from "../../../store/features/tableTotalsSlice";

const Menu = ({ selectedTable,  onOrderItemsChange, refreshTables, setUserToTable}) => {
  const updateTotals = (updatedTotals) => {
    dispatch(updateTableTotals(updatedTotals));
  };
  const tableTotals = useSelector(state => state.tableTotals);
  const dispatch = useDispatch();
console.log(selectedTable);

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState({});

  const newTableTotals = useSelector(state => state.newTableTotals);  
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
            return { ...itemDetails, quantity };
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

  const onAddToOrder = (item) => {
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
      updateTotals({ ...newTableTotals, [tableId]: newTotal });
  
      if (onOrderItemsChange) {
        onOrderItemsChange(orderItems);
      }
      return updatedItems;
    });
  };
  
  
  const onIncrement = (itemId) => {
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
        updateTotals({ ...newTableTotals, [tableId]: newTotal });
        };
      
      if (onOrderItemsChange) {
        onOrderItemsChange(orderItems);
      }
      return updatedItems;
    });
  };
  
  const onDecrement = (itemId) => {
    console.log("itemId from onDecrement function", itemId);
    setOrderItems(prevItems => {
      const updatedItems = { ...prevItems };
      const tableId = selectedTable;
  
      if (updatedItems[tableId] && updatedItems[tableId][itemId] && updatedItems[tableId][itemId].quantity > 1) {
        updatedItems[tableId][itemId].quantity -= 1;
        
        // Update total price here
        const updatedTotal = calculateTotalPrice(updatedItems[selectedTable]);
        updateTotals({ ...newTableTotals, [selectedTable]: updatedTotal });
      }
      if (onOrderItemsChange) {
        onOrderItemsChange(orderItems);
      }
      return updatedItems;
    });
  };
  
  

  
  const onDelete = (itemId) => {
    setOrderItems(prevItems => {
      const updatedItems = { ...prevItems };
      const tableId = selectedTable;
  
      if (updatedItems[tableId] && updatedItems[tableId][itemId]) {
        delete updatedItems[tableId][itemId];
  
        // Update total price here
        const updatedTotal = calculateTotalPrice(updatedItems[tableId]);
        updateTotals({ ...newTableTotals, [tableId]: updatedTotal });
      }
      if (onOrderItemsChange) {
        onOrderItemsChange(orderItems);
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
    const userId = localStorage.getItem("userId");
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

      await refreshTables();
      setOrderItems(prevItems => {
        const updatedItems = { ...prevItems };
        delete updatedItems[tableNumber];
        return updatedItems;
      });
     
      // Display success message or handle UI updates
    } catch (error) {
      console.error('Error creating order:', error);
      // Display error message or handle UI updates
    }
};


  
  // const getTableIdFromNumber = (tableNumber) => {
  //   const table = tables.find(t => t.table_number === tableNumber);
  //   return table ? table.table_id : null;
  // };
  console.log("FROM menu.js: selectedTable",selectedTable);




  const resetTableTotal = (tableId) => {
    console.log(`Resetting total for table ${tableId}`);
    updateTotals({ ...newTableTotals, [tableId]: 0 });
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
      <MenuList onSubcategorySelect={setSelectedSubcategory} category={getCategoryFromSubcategory(selectedSubcategory)} onSearchInputChange={handleMenuSearchChange} searchInput={searchInput}   setSearchInput={setSearchInput}/>
      <div className="border-t border-gray-900"></div>{" "}
      <MenuItemDetail searchInput={searchInput} category={getCategoryFromSubcategory(selectedSubcategory)}  subcategory={selectedSubcategory || autoSelectedSubcategory }  menuItems={menuItems} onAddToOrder={onAddToOrder} />
      <div className="border-t border-gray-900"></div>{" "}
      <OrderSummary
        orderItems={orderItems[selectedTable] || []} // Pass only the current table's orders 
        unpaidItemsDetails={unpaidItemsDetails}
        onIncrement={(item) => onIncrement(item)}
        onDecrement={(item) => onDecrement(item)}
        onDelete={(item) => onDelete(item)}
        totalPrice={tableTotals[selectedTable]}   
        onCreateOrder={() => createOrder(selectedTable)}
        selectedTable={selectedTable}
        refreshUnpaidItems={refreshUnpaidItems}
        onResetTableTotals={() => resetTableTotal(selectedTable)}
        refreshTables={refreshTables}
        setUserToTable={setUserToTable}
        />
    </div>
  );
};

export default Menu;
