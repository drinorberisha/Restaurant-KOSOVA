import React, {useEffect, useState} from "react";
import MenuList from "./menuList/menuList";
import MenuItemDetail from "./listItems/listItems";
import OrderSummary from "./orderSummary/orderSummary";
import { fetchInventoryItems, fetchAllTables, orderCreate, fetchUnpaidItems} from "@/utils/api";

const Menu = ({ selectedTable,  onOrderItemsChange,setNewTableTotals,}) => {


console.log(selectedTable);

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [totalPrice, setTotalPrice] = useState(0.0);

  const [tableTotals, setTableTotals] = useState({});
  const [tables, setTables] = useState(
    new Array(16).fill(null).map((_, index) => ({
      table_id: index + 1,
      table_number: index + 1,
      status: "free",
      current_order_id: null
    }))
  );

  const [unpaidItemIds, setUnpaidItemIds] = useState([]);
  const [unpaidItemsDetails, setUnpaidItemsDetails] = useState([]);

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
 



  useEffect(() => {
    const initializeTables = async () => {
      try {
        const tableData = await fetchAllTables();
        setTables(tableData);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    initializeTables();

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
      setTableTotals(prevTotals => {
        
        console.log("Selected Table:", selectedTable);
        console.log("Order Items for Selected Table:", orderItems[selectedTable]);
        console.log("the calculation of total:",newTotal)
        return { ...prevTotals, [tableId]: newTotal };
      });




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
       setTableTotals(prevTotals => {
        const newTotal = calculateTotalPrice(orderItems[tableId]);
        console.log("Selected Table:", selectedTable);
        console.log("Order Items for Selected Table:", orderItems[selectedTable]);
        console.log("the calculation of total:",newTotal)
        return { ...prevTotals, [tableId]: newTotal };
      });
      }
      if (onOrderItemsChange) {
        onOrderItemsChange(orderItems);
      }
      return updatedItems;
    });
  };
  
  const onDecrement = (itemId) => {
    console.log("itemId from onDecrement fucntion", itemId);
    setOrderItems(prevItems => {
      const updatedItems = { ...prevItems };
      const tableId = selectedTable;
  
      if (updatedItems[tableId] && updatedItems[tableId][itemId] && updatedItems[tableId][itemId].quantity > 1) {
        updatedItems[tableId][itemId].quantity -= 1;
  
        // Update total price here
        setTableTotals(prevTotals => ({
          ...prevTotals,
          [selectedTable]: calculateTotalPrice(orderItems[selectedTable])
        }));
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
        setTableTotals(prevTotals => ({
          ...prevTotals,
          [tableId]: updatedTotal
        }));
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
    const currentTotalPrice = tableTotals[tableNumber] || 0; // Get the total price from tableTotals

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
  
      const response = await orderCreate(tableNumber, currentTotalPrice, itemsData);
      console.log('Order created:', response);
      console.log("unpaidItemsDetails:",unpaidItemsDetails);
      // Reset state after order creation
      setOrderItems(prevItems => {
        const updatedItems = { ...prevItems };
        delete updatedItems[tableNumber];
        return updatedItems;
      });
      setTableTotals(prevTotals => ({
        ...prevTotals,
        [tableNumber]: 0 // Reset the total price for this table
      }));
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

  useEffect(() => {
    // Update newTableTotals in the parent component whenever tableTotals changes
    setNewTableTotals(tableTotals);
  }, [tableTotals, setNewTableTotals]);


  return (
    <div className="bg-gray-100 p-2.5 rounded-md h-full flex flex-col">
      <MenuList onSubcategorySelect={setSelectedSubcategory}/>
      <div className="border-t border-gray-900"></div>{" "}
      <MenuItemDetail  category={getCategoryFromSubcategory(selectedSubcategory)} subcategory={selectedSubcategory} menuItems={menuItems} onAddToOrder={onAddToOrder} />
      <div className="border-t border-gray-900"></div>{" "}
      <OrderSummary
        orderItems={orderItems[selectedTable] || []} // Pass only the current table's orders 
        unpaidItemsDetails={unpaidItemsDetails}
        onIncrement={(item) => onIncrement(item)}
        onDecrement={(item) => onDecrement(item)}
        onDelete={(item) => onDelete(item)}
        totalPrice={tableTotals[selectedTable]} // Total price for the current table        
        onCreateOrder={() => createOrder(selectedTable)}
      />

    </div>
  );
};

export default Menu;
