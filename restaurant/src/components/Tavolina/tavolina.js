import React from "react";
import tableImage from "../../../public/Tables.png";
import backgroundImage from "../../../public/bg2.jpg";
import Image from "next/image";

function Tables({ selectedTable, onSelectTable }) {
  const tables = new Array(16).fill({});

  return (
    <div className="flex flex-col h-full mt-[6.1%]">
      <div className="flex justify-between items-center p-5 bg-white bg-cover bg-center bg-no-repeat rounded-t-lg bg-[url('/bg2.jpg')]">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="table number..."
            className="w-full px-10 py-2.5 text-lg box-border rounded-full border border-gray-300 h-7 text-black"
          />
          <button
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-2xl bg-transparent border-none cursor-pointer"
          >
            🔍
          </button>
        </div>

        <select className="ml-2 px-2.5 py-1 rounded-full border border-gray-300 h-7 text-center text-black">
          <option value="all">Placement: All</option>
          <option value="outside">Placement: Outside</option>
          <option value="inside">Placement: Inside</option>
        </select>

        <select className="ml-2 px-2.5 py-1 rounded-full border border-gray-300 h-7 text-center text-black">
          <option value="all">Waiter: All</option>
          <option value="bob">Waiter: Bob</option>
          <option value="mike">Waiter: Mike</option>
        </select>

        <select className="ml-2 px-2.5 py-1 rounded-full border border-gray-300 h-7 text-center text-black">
          <option value="all">Status: All</option>
          <option value="free">Status: Free</option>
          <option value="occupied">Status: Occupied</option>
        </select>
      </div>

      <div className="grid grid-cols-4 gap-5 p-5 overflow-y-auto bg-black bg-opacity-60">
        {tables.map((table, index) => (
          <div
            key={index}
            className={`text-center ${index === selectedTable ? "text-black bg-gray-300" : "text-white"} rounded-lg p-1.5`}
            onClick={() => onSelectTable(index)}
          >
            <Image
              src={tableImage}
              alt="Table"
              width={75}
              height={75}
              className="w-18 h-18 rounded-full mx-auto"
            />
            
            <div>Table {index + 1} - 3€</div>
            <div>Waiter Name</div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-white bg-cover bg-center bg-no-repeat rounded-b-lg bg-[url('/bg2.jpg')]">
        {/* Insert footer content here */}
      </div>
    </div>
  );
}

export default Tables;
