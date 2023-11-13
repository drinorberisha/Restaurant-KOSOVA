import React from "react";
import MenuList from "./menuList/menuList";
import MenuItemDetail from "./listItems/listItems";
import OrderSummary from "./orderSummary/orderSummary";

const Menu = ({
  selectedItem,
  onSelectItem,
  orderSummaries,
  selectedTable,
  onIncrement,
  onDecrement,
  onDelete,
  onAddToOrder,
  calculateTotalPrice,
}) => {
  return (
    <div className="bg-gray-100 p-2.5 rounded-md h-full flex flex-col">
      <MenuList onSelectItem={onSelectItem} selectedItem={selectedItem} />
      <MenuItemDetail item={selectedItem} onAddToOrder={onAddToOrder} />
      <OrderSummary
        orderItems={orderSummaries[selectedTable]}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onDelete={onDelete}
        totalPrice={calculateTotalPrice(orderSummaries[selectedTable])}
      />
    </div>
  );
};

export default Menu;
