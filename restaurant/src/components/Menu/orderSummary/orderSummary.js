import React from "react";
import background from "../../../../public/background.jpg"

function OrderSummary({
  orderItems,
  onIncrement,
  onDecrement,
  onDelete,
  totalPrice,
  onCreateOrder
}) {

  return (
    <div className="h-[40%] border-b-2  border-l-2 border-black">
      <div>Order Summary:</div>
      <div className="border border-gray-300 rounded-2xl px-2.5 mt-2.5 mb-2.5 overflow-y-auto max-h-56 bg-cover bg-no-repeat bg-fixed bg-[url('/background.jpg')] bg-center bg-blend-darken">
        {orderItems.map((item, index) => (
          <div key={index} className="text-white flex justify-between items-center py-1 border-b border-gray-300">
            {item.name} - {item.quantity} items - {item.price}
            <div className="flex items-center justify-center">
              <button className="px-2 py-0.5 m-1 cursor-pointer text-lg" onClick={() => onDecrement(item)}>
                -
              </button>
              <span className="align-middle mx-1">/</span>
              <button className="px-2 py-0.5 m-1 cursor-pointer text-lg" onClick={() => onIncrement(item)}>
                +
              </button>
              <button className="ml-2.5 bg-transparent border-none cursor-pointer text-lg text-red-500" onClick={() => onDelete(item)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 font-bold">Total price: {totalPrice}€</div>
      <button className="pay-button" onClick={onCreateOrder}>Pay</button>
    </div>
  );
}

export default OrderSummary;
