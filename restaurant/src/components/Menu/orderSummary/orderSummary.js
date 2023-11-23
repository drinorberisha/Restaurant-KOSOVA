import React, { useState } from "react";

function OrderSummary({
  orderItems,
  onIncrement,
  onDecrement,
  onDelete,
  totalPrice,
  onCreateOrder
}) {
  const currentTableItems = Object.values(orderItems || {}).flat();
  const [totalOrder, setTotalOrder] = useState('currentorder');

  const currentOrderHandle = () => {
    setTotalOrder('currentorder');
  }

  const totalOrderHandle = () => {
    setTotalOrder('totalorder');
  }

  return (
    <div className="h-[40%] ">
      <div className="flex flex-row justify-between"> {/* Updated this line */}
        <p className="mr-5">Summary:</p>
        <div>
          <button className="mr-5" onClick={currentOrderHandle}>
            Current Order
          </button>
          <button onClick={totalOrderHandle}>Total Order</button>
        </div>
      </div>
      <div className="border border-gray-300 rounded-2xl px-2.5 mt-2.5 mb-2.5 overflow-y-auto bg-cover bg-no-repeat bg-fixed bg-[url('/loginView.jpg')] bg-center bg-blend-darken" style={{ height: "27vh" }}>
        {currentTableItems.map((item, index) => (
          <div key={index} className="text-white flex justify-between items-center py-1 border-b border-gray-300">
            {item.name} - {item.quantity} items - {item.price}€
            <div className="flex items-center justify-center">
              <button className="px-2 py-0.5 m-1 cursor-pointer text-lg" onClick={() => onDecrement(item.item_id)}>
                -
              </button>
              <span className="align-middle mx-1">/</span>
              <button className="px-2 py-0.5 m-1 cursor-pointer text-lg" onClick={() => onIncrement(item.item_id)}>
                +
              </button>
              <button className="ml-2.5 bg-transparent border-none cursor-pointer text-lg text-red-500" onClick={() => onDelete(item.item_id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row mt-2.5 font-bold">
        <p className="mr-5">Total price: {totalPrice}€</p>
        <button className="pay-button" onClick={onCreateOrder}>Shtyp Porosine</button>
      </div>
    </div>
  );
}

export default OrderSummary;
