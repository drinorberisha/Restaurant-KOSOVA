import React, { useState, useEffect } from "react";
import { markOrdersAsPaid, updateTableStatus } from "@/utils/api";
import { useSelector } from "react-redux";

function OrderSummary({
  orderItems,
  unpaidItemsDetails,
  onIncrement,
  onDecrement,
  onDelete,
  totalPrice,
  onCreateOrder,
  selectedTable,
  refreshUnpaidItems,
  onResetTableTotals,
  refreshTables,
}) {
  const userToTable = useSelector((state) => state.userTable);
  const myTables = useSelector((state) => state.myTables.tables);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const currentTableItems = Object.values(orderItems || {}).flat();
  const [totalOrder, setTotalOrder] = useState("currentorder");
  const handleCreateOrder = async () => {
    setTotalOrder("totalorder");
    await onCreateOrder();
  };
  const currentOrderHandle = () => {
    setTotalOrder("currentorder");
  };

  const totalOrderHandle = () => {
    setTotalOrder("totalorder");
  };
  const calculateTotalPrice = () => {
    return unpaidItemsDetails.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  useEffect(() => {
    // Check the status of the selectedTable and update totalOrder
    const selectedTableStatus = myTables.find(
      (table) => table.table_id === selectedTable
    )?.status;
    if (selectedTableStatus === "free") {
      setTotalOrder("currentorder");
    } else {
      setTotalOrder("totalorder");
    }
  }, [selectedTable, myTables]);

  // const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleMarkOrdersAsPaid = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("User ID not found");
        return;
      }

      await updateTableStatus(selectedTable, "free");

      const response = await markOrdersAsPaid(selectedTable, userId);

      console.log("Orders marked as paid:", response);
      setErrorMessage(""); // Clear any previous error messages
      await refreshTables();
      // Handle the response, e.g., update the UI or show a confirmation message
      await refreshUnpaidItems();
      onResetTableTotals();
      setTotalOrder("currentorder");
      setSuccessMessage("Pagesa eshte kryer me sukses! Fatura po shtypet.");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      console.error("Error marking orders as paid:", error);
      if (error.response && error.response.status === 403) {
        setErrorMessage(error.response.data.message);
        setTimeout(() => setErrorMessage(""), 3000);
        updateTableStatus(selectedTable, "busy");
      } else {
        setErrorMessage("An error occurred while processing your request.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
  };

  const priceAndButton = () => {
    const greenButtonClasses =
      "bg-green-500 text-white font-bold py-1 px-2 rounded-full";
    const redButtonClasses =
      "bg-red-500 text-white font-bold py-1 px-2 rounded-full";

    if (totalOrder === "totalorder") {
      return (
        <div className="flex flex-row justify-between mt-2.5">
          <p className="mr-5">Total price: {calculateTotalPrice()}€</p>
          <div>
            <button
              className={greenButtonClasses}
              onClick={handleMarkOrdersAsPaid}
            >
              Shtyp Faturen
            </button>
            <button
              className={`${redButtonClasses} ml-3`}
              onClick={handleMarkOrdersAsPaid}
            >
              Mbyll Tavolinen
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-row justify-between mt-2.5">
          <p className="mr-5">Total price: {calculateCurrentOrderTotal()}€</p>
          <button className={greenButtonClasses} onClick={handleCreateOrder}>
            Shtyp Porosine
          </button>
        </div>
      );
    }
  };

  const calculateCurrentOrderTotal = () => {
    // Sum up the price for each item in the current order
    return currentTableItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const renderItems = () => {
    if (totalOrder === "totalorder") {
      // Render details for unpaid items
      return unpaidItemsDetails.map((item, index) => (
        <div
          key={index}
          className="text-white flex justify-between items-center py-1 border-b border-gray-300"
        >
          {item.name} - {item.quantity} items - {item.price}€
        </div>
      ));
    } else {
      return currentTableItems.map((item, index) => (
        <div
          key={index}
          className="text-white flex justify-between items-center py-1 border-b border-gray-300"
        >
          {item.name} - {item.quantity} items - {item.price}€
          <div className="flex items-center justify-center">
            <button
              className="px-2 py-0.5 m-1 cursor-pointer text-lg"
              onClick={() => onDecrement(item.item_id, userToTable)}
            >
              -
            </button>
            <span className="align-middle mx-1">/</span>
            <button
              className="px-2 py-0.5 m-1 cursor-pointer text-lg"
              onClick={() => onIncrement(item.item_id, userToTable)}
            >
              +
            </button>
            <button
              className="ml-2.5 bg-transparent border-none cursor-pointer text-lg text-red-500"
              onClick={() => onDelete(item.item_id, userToTable)}
            >
              🗑️
            </button>
          </div>
        </div>
      ));
    }
  };

  return (
    <div className="h-[43%] pt-1.5 ">
      <div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
      <div>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>

      <div className="flex flex-row justify-between">
        <p className="mr-5">Summary:</p>
        <div>
          <button
            className={`transition duration-300 ease-in-out border-2 mr-5 px-4 py-2 text-sm font-medium tracking-wide rounded-full ${
              totalOrder === "currentorder"
                ? "bg-green-500 border-black"
                : "border-black"
            }`}
            onClick={currentOrderHandle}
          >
            Current Order
          </button>
          <button
            className={`transition duration-300 ease-in-out border-2 px-4 py-2 text-sm font-medium tracking-wide rounded-full ${
              totalOrder === "totalorder"
                ? "bg-green-500 border-black"
                : "border-black"
            }`}
            onClick={totalOrderHandle}
          >
            Total Order
          </button>
        </div>
      </div>
      <div
        className="border border-gray-300 rounded-2xl px-2.5 mt-2.5 mb-2.5 overflow-y-auto bg-cover bg-no-repeat bg-fixed bg-[url('/loginView.jpg')] bg-center bg-blend-darken"
        style={{ height: "27vh" }}
      >
        {renderItems()}
      </div>
      {priceAndButton()}
    </div>
  );
}

export default OrderSummary;
