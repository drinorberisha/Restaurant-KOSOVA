import React from "react";
import MenuList from "./menuList/menuList";
import MenuItemDetail from "./listItems/listItems";
import OrderSummary from "./orderSummary/orderSummary";

const menuContainerStyle = {
  backgroundColor: "#f6f6f6",
  padding: "10px",
  borderRadius: "5px",
  height: "100%",
 
  display: "flex",
  flexDirection: "column",
};
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
    <div style={menuContainerStyle}>
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
