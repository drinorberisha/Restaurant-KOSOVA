// Menu.js -- render this at index.js
import React from "react";

const Menu = () => {
  return (
    <div className="bg-white p-6 border border-gray-300 rounded flex flex-col">
      <MenuList />
      <div className="border-t border-gray-300"></div>{" "}
      {/* Reduced margin Divider */}
      <MenuItemList />
      <div className="border-t border-gray-300"></div>{" "}
      {/* Reduced margin Divider */}
      <OrderSummary />
    </div>
  );
};
export default Menu;

// MenuList.js
const MenuList = () => {
  const dummyItems = Array.from({ length: 28 }, (_, i) => `Item ${i + 1}`);
  return (
    <div className="px-4 pt-2 pb-2" style={{ height: "26vh" }}>
      <input
        type="search"
        placeholder="Search menu..."
        className="mb-3 p-2 border border-gray-300 rounded w-full"
      />
      <div
        className="grid grid-cols-5 gap-2 overflow-y-auto"
        style={{ maxHeight: "17vh" }}
      >
        {dummyItems.map((item) => (
          <div key={item} className="p-2 bg-blue-100 text-center rounded">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

// MenuItemList.js
const MenuItemList = () => {
  const dummyTypes = Array.from({ length: 28 }, (_, i) => `Type ${i + 1}`);
  return (
    <div className="p-4 " style={{ height: "26vh" }}>
      <div className="font-bold mb-2">Coffee Types:</div>
      <div
        className="grid grid-cols-5 gap-2 overflow-y-auto"
        style={{ maxHeight: "17vh" }}
      >
        {dummyTypes.map((type) => (
          <div key={type} className="p-2 bg-green-100 rounded">
            {type}
          </div>
        ))}
      </div>
    </div>
  );
};

// OrderSummary.js
const OrderSummary = () => {
  const dummySummary = Array.from({ length: 8 }, (_, i) => `Order ${i + 1}`);
  return (
    <div className="p-4" style={{ height: "26vh" }}>
      <div className="font-bold mb-2">Order Summary:</div>
      <div
        className="flex flex-col gap-2 overflow-y-auto rounded border border-gray-300 p-2"
        style={{ height: "25vh" }}
      >
        {dummySummary.map((order) => (
          <div key={order} className="p-2 bg-yellow-100 rounded">
            {order}
          </div>
        ))}
      </div>
      <div className="mt-4 font-bold">Total price:</div>
    </div>
  );
};
