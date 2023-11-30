import React, { useEffect, useState } from "react";
import tableImage from "../../../public/Tables.png";
import { fetchAllTableIds, fetchAllTables, fetchAllUsers } from "@/utils/api";
import backgroundImage from "../../../public/bg2.jpg";
import Image from "next/image";
import { useSelector } from "react-redux"; // Import useSelector

function Tables({ selectedTable, onSelectTable }) {
  const [selectedPlacement, setSelectedPlacement] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedWaiter, setSelectedWaiter] = useState("all");

  const userToTable = useSelector((state) => state.userTable);
  const myTables = useSelector((state) => state.myTables.tables);
  const tableTotals = useSelector((state) => state.tableTotals);

  const handlePlacementChange = (event) => {
    setSelectedPlacement(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleWaiterChange = (event) => {
    setSelectedWaiter(event.target.value);
  };
  // Filter function
  const waiterIds = Object.values(userToTable)
    .filter((user) => user !== null && user !== undefined) // Ensure user is defined
    .map((user) => user.user_id)
    .filter((user_id, index, array) => array.indexOf(user_id) === index); // Remove duplicates
  console.log("userToTable inside tables.js:", userToTable);
  console.log("These are the waiter Ids", waiterIds);

  // Combined filter function
  const filterTables = (tables) => {
    return tables.filter((table) => {
      // const placementMatch = selectedPlacement === 'all' || table.placement === selectedPlacement;
      // const statusMatch = selectedStatus === 'all' || table.status === selectedStatus;
      const waiterMatch =
        selectedWaiter === "all" ||
        (userToTable[table.table_id] &&
          String(userToTable[table.table_id].user_id) ===
            String(selectedWaiter));
      // console.log(`Table: ${table.table_id}, Waiter: ${userToTable[table.table_id]?.user_id}, Selected: ${selectedWaiter}, Match: ${waiterMatch}`);
      // console.log("CHECKING HEREEEEEE:", userToTable[table.table_id].user_id);
      // console.log("waiterMatch", waiterMatch);
      return waiterMatch;
    });
  };
  const filteredTables = filterTables(myTables);

  const [searchQuery, setSearchQuery] = useState("");

  const searchFilter = (tables) => {
    return tables.filter((table) => {
      return table.table_number.toString().includes(searchQuery);
    });
  };
  // Combine this with the other filters
  const finalFilteredTables = searchFilter(filterTables(myTables));
  console.log("Selected Waiter:", selectedWaiter);
  console.log("User to Table Mapping:", userToTable);
  console.log("Filtered Tables:", filterTables(myTables));

  // waiters api call and array
  const [waiters, setWaiters] = useState([]);

  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        const fetchedWaiters = await fetchAllUsers();
        console.log("fetched users", fetchedWaiters);
        setWaiters(fetchedWaiters);
      } catch (error) {
        console.error("Error fetching waiters:", error);
      }
    };
    fetchWaiters();
  }, []);
  console.log("WAITERS:", waiters);

  const handleSelectTable = (tableNumber) => {
    onSelectTable(tableNumber);
  };

  const tableGridHeight = "500px"; // Adjust this value based on your layout requirements

  return (
    <div className="flex flex-col h-full mt-[6.1%]">
      <div className="flex justify-between items-center p-5 bg-white bg-cover bg-center bg-no-repeat rounded-t-lg bg-[url('/bg2.jpg')]">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="table number..."
            className="w-full px-10 py-2.5 text-lg box-border rounded-full border border-gray-300 h-7 text-black"
          />
          <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-2xl bg-transparent border-none cursor-pointer">
            🔍
          </button>
        </div>

        <select
          onChange={handlePlacementChange}
          className="ml-2 px-2.5 py-1 rounded-full border border-gray-300 h-7 text-center text-black"
        >
          <option value="all">Placement: All</option>
          <option value="terasa">Placement: Terasa</option>
          <option value="brenda">Placement: Brenda</option>
        </select>

        <select
          onChange={handleWaiterChange}
          className="ml-2 px-2.5 py-1 rounded-full border border-gray-300 h-7 text-center text-black"
        >
          <option value="all">Waiter: All</option>
          {waiters.map((waiter) => (
            <option key={waiter.user_id} value={waiter.user_id}>
              Waiter: {waiter.username}
            </option>
          ))}
        </select>

        <select
          onChange={handleStatusChange}
          className="ml-2 px-2.5 py-1 rounded-full border border-gray-300 h-7 text-center text-black"
        >
          <option value="all">Status: All</option>
          <option value="free">Status: Free</option>
          <option value="busy">Status: Busy</option>
        </select>
      </div>

      <div
        className="grid grid-cols-4 gap-5 p-5 overflow-y-auto bg-black bg-opacity-60"
        style={{ maxHeight: "70vh" }}
      >
        {filteredTables && filteredTables.length > 0 ? (
          filteredTables.map((table) => {
            // Determine the class based on the table's status
            let tableClass =
              table.table_number === selectedTable
                ? "text-black bg-gray-300" // Selected table
                : "text-white"; // Unselected table

            // Additional styling for busy tables
            if (table.status === "busy") {
              tableClass += " bg-red-500"; // Busy: Red background
            }

            return (
              <div
                key={table.table_id}
                className={`text-center rounded-lg p-1.5 ${tableClass}`}
                onClick={() => handleSelectTable(table.table_number)}
              >
                <Image
                  src={tableImage}
                  alt="Table"
                  width={75}
                  height={75}
                  className="w-18 h-18 rounded-full mx-auto"
                />
                <div>
                  Table {table.table_number} - Total:{" "}
                  {tableTotals[table.table_id] || 0}€
                </div>
                <div>
                  Waiter:{" "}
                  {table.status === "busy"
                    ? userToTable[table.table_id]?.username || "Error"
                    : "Free"}
                </div>
              </div>
            );
          })
        ) : (
          <div>No tables available.</div>
        )}
      </div>

      <div className="p-3 bg-white bg-cover bg-center bg-no-repeat rounded-b-lg bg-[url('/bg2.jpg')]">
        {/* Insert footer content here */}
      </div>
    </div>
  );
}

export default Tables;
