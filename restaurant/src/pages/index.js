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
  const [selectedTable, setSelectedTable] = useState(0);

  const handleIncrement = (item) => {
    const updatedSummaries = [...orderSummaries];
    const updatedOrders = updatedSummaries[selectedTable].map((orderItem) =>
      orderItem.name === item.name
        ? { ...orderItem, quantity: orderItem.quantity + 1 }
        : orderItem
    );
    updatedSummaries[selectedTable] = updatedOrders;
    setOrderSummaries(updatedSummaries);
  };

  const handleDecrement = (item) => {
    const updatedSummaries = [...orderSummaries];
    const currentTableOrders = updatedSummaries[selectedTable];
    const updatedQuantity = item.quantity - 1;
    if (updatedQuantity === 0) {
      updatedSummaries[selectedTable] = currentTableOrders.filter(
        (orderItem) => orderItem.name !== item.name
      );
    } else {
      updatedSummaries[selectedTable] = currentTableOrders.map((orderItem) =>
        orderItem.name === item.name
          ? { ...orderItem, quantity: updatedQuantity }
          : orderItem
      );
    }
    setOrderSummaries(updatedSummaries);
  };

  const handleDeleteOrderItem = (item) => {
    const updatedSummaries = [...orderSummaries];
    const updatedOrders = updatedSummaries[selectedTable].filter(
      (orderItem) => orderItem.name !== item.name
    );
    updatedSummaries[selectedTable] = updatedOrders;
    setOrderSummaries(updatedSummaries);
  };

  const handleAddToOrder = (type) => {
    const updatedSummaries = [...orderSummaries];
    const currentTableOrders = updatedSummaries[selectedTable] || [];
    const existingItem = currentTableOrders.find(
      (orderItem) => orderItem.name === type.name
    );
    if (existingItem) {
      updatedSummaries[selectedTable] = currentTableOrders.map((item) =>
        item.name === type.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedSummaries[selectedTable] = [
        ...currentTableOrders,
        { ...type, quantity: 1 },
      ];
    }
    setOrderSummaries(updatedSummaries);
  };

  const calculateTotalPrice = (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="h-fit">
      <Nav />
      <div className="grid grid-cols-2 gap-5 p-2.5 max-h-full">
        <div className="h-full">
          <Menu
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            orderSummaries={orderSummaries}
            selectedTable={selectedTable}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onDelete={handleDeleteOrderItem}
            onAddToOrder={handleAddToOrder}
            calculateTotalPrice={calculateTotalPrice}
          />
        </div>
        <div className="rounded-lg h-full">
          <Tables
            selectedTable={selectedTable}
            onSelectTable={setSelectedTable}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;


// export async function getServerSideProps(context) {
//     const isAuthenticated = await checkAuth(context);
  
//     if (!isAuthenticated) {
//       return {
//         redirect: {
//           destination: '/auth/login',
//           permanent: false,
//         },
//       };
//     }
  
//     return {
//       props: {}, // will be passed to the page component as props
//     };
//   }
