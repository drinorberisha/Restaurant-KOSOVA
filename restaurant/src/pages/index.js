// pages/index.js

import React, { useState } from "react";
import  {menuItems} from "../components/Menu/items";
import Tables from "../components/Tavolina/tavolina";
import Nav from "../components/Navigation/nav";
import Menu from "../components/Menu/menu";

function Home() {
  const [selectedItem, setSelectedItem] = useState(menuItems[0]);
  const initialOrders = new Array(16).fill([]).map(() => []);
  const [orderSummaries, setOrderSummaries] = useState(initialOrders);

  const [selectedTable, setSelectedTable] = useState(1);

  const [tableTotals, setTableTotals] = useState({});
  const [tableOrders, setTableOrders] = useState({});
  const calculateTotalPrice = (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleSelectTable = (tableNumber) => {
  
      setSelectedTable(tableNumber);
    };
    const handleOrderItemsChange = (newOrderItems) => {
      setTableOrders(prevOrders => ({
        ...prevOrders,
        [selectedTable]: newOrderItems
      }));
    };
  return (
    <div className="min-h-screen min-w-full bg-cover bg-no-repeat bg-center bg-login-view overflow-hidden">
      <Nav />
      <div className="grid grid-cols-2 gap-5 p-2.5 max-h-full">
        <div className="h-full">
          <Menu
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            orderSummaries={orderSummaries}
            selectedTable={selectedTable}

            tableOrders={tableOrders}
            setTableOrders={setTableOrders}
            onOrderItemsChange={handleOrderItemsChange}

            calculateTotalPrice={calculateTotalPrice}
            tableTotals={tableTotals}
          />
        </div>
        <div className="rounded-lg h-full">
          <Tables
            selectedTable={selectedTable}
            tableTotals={tableTotals}
            onSelectTable={handleSelectTable}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;

