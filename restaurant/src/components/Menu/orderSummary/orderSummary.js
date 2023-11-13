import React from "react";
import background from "../../../../public/background.jpg"

function OrderSummary({
  orderItems,
  onIncrement,
  onDecrement,
  onDelete,
  totalPrice,
}) {
  const orderItemStyle = {
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 0",
    borderBottom: "1px solid #ddd",
  };

  const totalPriceStyle = {
    marginTop: "10px",
    fontWeight: "bold"
  };

  const buttonContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const deleteButtonStyle = {
    marginLeft: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "red",
  };

  const buttonStyle = {
    padding: "2px 8px",
    margin: "0 5px",
    cursor: "pointer",
    fontSize: "16px",
  };

  const dividerStyle = {
    verticalAlign: "middle",
    margin: "0 0px",
  };

  const roundBoxStyle = {
    border: "1px solid #ddd",
    borderRadius: "15px",
    padding: "10px",
    marginTop: "10px",
    marginBottom: "10px",
    overflowY: "auto",
    maxHeight: "190px",
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${background}')`,
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0% -2.5%",
  };

  return (
    <div style={{height:"40%"}}>
      <div>Order Summary:</div>
      <div style={roundBoxStyle}>
        {orderItems.map((item, index) => (
          <div key={index} style={orderItemStyle}>
            {item.name} - {item.quantity} items - {item.price}
            <div style={buttonContainerStyle}>
              <button style={buttonStyle} onClick={() => onDecrement(item)}>
                -
              </button>
              <span style={dividerStyle}>/</span>
              <button style={buttonStyle} onClick={() => onIncrement(item)}>
                +
              </button>
              <button style={deleteButtonStyle} onClick={() => onDelete(item)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={totalPriceStyle}>Total price: {totalPrice}€</div>
    </div>
  );
}

export default OrderSummary;
