import React, {useEffect, useState} from "react";
import MenuList from "./menuList/menuList";
import MenuItemDetail from "./listItems/listItems";
import OrderSummary from "./orderSummary/orderSummary";
import { fetchInventoryItems, fetchAllTables, orderCreate } from "@/utils/api";

const Menu = (selectedTable) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState({}); // Initialize orderItems state
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

  console.log(orderItems);

  useEffect(() => {
    // Calculate totals for each table
    const totals = {};
    Object.entries(orderItems).forEach(([tableId, itemDetails]) => {
      // Ensure itemDetails is an object and has a quantity and price
      if (itemDetails && typeof itemDetails === 'object' && itemDetails.quantity && itemDetails.price) {
        totals[tableId] = itemDetails.quantity * itemDetails.price;
      } else {
        totals[tableId] = 0; // Default to 0 if no valid itemDetails found
      }
    });
    setTableTotals(totals);
  }, [orderItems]);



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
      const currentQuantity = prevItems[item.item_id]?.quantity || 0;
      return {
        ...prevItems,
        [item.item_id]: {
          name: item.item_name,
          item_id:item.item_id,
          price: item.price,
          quantity: currentQuantity + 1
        }
      };
    });
  };

  const onIncrement = (itemId) => {
    setOrderItems(prevItems => {
      const updatedItems = { ...prevItems };
      if (updatedItems[itemId]) {
        updatedItems[itemId].quantity += 1;
      }
      return updatedItems;
    });
  };
  
  const onDecrement = (itemId) => {
    setOrderItems(prevItems => {
      const updatedItems = { ...prevItems };
      if (updatedItems[itemId] && updatedItems[itemId].quantity > 1) {
        updatedItems[itemId].quantity -= 1;
      } else {
        delete updatedItems[itemId];
      }
      return updatedItems;
    });
  };
  
  const onDelete = (itemId) => {
    setOrderItems(prevItems => {
      const updatedItems = { ...prevItems };
      delete updatedItems[itemId];
      return updatedItems;
    });
  };
  
  const calculateTotalPrice = () => {
    return Object.values(orderItems).reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const createOrder = async (tableNumber) => {
    // const tableID = getTableIdFromNumber(tableId);
    if (!tableNumber) {
      console.error('Table ID not found for the selected table number');
      return;
    }
    setTotalPrice(calculateTotalPrice());
    try {
      const response = await orderCreate(tableNumber, totalPrice);
      console.log('Order created:', response);
      // Reset order items and other states as necessary
      setOrderItems({});
      // Display success message or handle UI updates
    } catch (error) {
      console.error('Error creating order:', error);
      // Display error message or handle UI updates
    }
  };
const TP = calculateTotalPrice();


  
  const getTableIdFromNumber = (tableNumber) => {
    const table = tables.find(t => t.table_number === tableNumber);
    return table ? table.table_id : null;
  };

  return (
    <div className="bg-gray-100 p-2.5 rounded-md h-full flex flex-col">
      <MenuList onSubcategorySelect={setSelectedSubcategory}/>
      <MenuItemDetail  category={getCategoryFromSubcategory(selectedSubcategory)} subcategory={selectedSubcategory} menuItems={menuItems} onAddToOrder={onAddToOrder} />
      <OrderSummary
        orderItems={Object.values(orderItems)}
        onIncrement={(item) => onIncrement(item.item_id)}
        onDecrement={(item) => onDecrement(item.item_id)}
        onDelete={(item) => onDelete(item.item_id)}
        totalPrice={calculateTotalPrice()}
        onCreateOrder={() => createOrder(selectedTable)}
      />

    </div>
  );
};

export default Menu;
