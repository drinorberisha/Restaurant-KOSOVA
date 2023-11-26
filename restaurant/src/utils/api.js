import axios from "axios";

const backendUrl = "http://localhost:3010";

export const apiCall = async (
  endpoint,
  subEndpoint,
  method,
  data = null,
  token = null
) => {
  const url = `${backendUrl}/api/${endpoint}/${subEndpoint}`;
  console.log("Constructed URL:", url);
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const config = {
    method: method,
    url: url,
    headers: headers,
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export const loginUser = async ( password) => {
  return await apiCall("check-password", "",  "POST", { password });
};
export const AddProduct = async (data) => {
  return await apiCall("menuitems", "add", "POST", { data });
};
export const fetchInventoryItems = async () => {
  return await apiCall('inventory', 'getItems', 'GET');
};

export const updateInventoryItem = async (inventoryId, updates) => {
  console.log(inventoryId,updates);
return await apiCall("inventory", inventoryId ,"PUT", {updates});
};


export const updateMenuItem = async (itemId, updates) => {
  return await apiCall("menuitems", itemId, "PUT", updates);
};

// Add this function to your existing API utility file

export const orderCreate = async (tableId, totalPrice, itemsData, userId) => {
  return await apiCall("orders", "create", "POST", { tableId, totalPrice, itemsData, userId });
};

export const fetchAllTableIds = async () => {
  return await apiCall('tables', 'getAllTableIds', 'GET');
};
export const fetchAllTables = async () => {
  return await apiCall('tables', 'getAllTables', 'GET');
};
export const fetchAllUsers= async () => {
  return await apiCall('users', '', 'GET' );
};
export const updateUser= async (userId, updates) => {
  return await apiCall('update', `${userId}`, 'PUT' ,updates );
};
export const addNewUser= async (userData) => {
  return await apiCall('register', '', 'POST' ,userData );
};

export const fetchUnpaidItems = async (tableId) => {
  return await apiCall('unpaidItems', `${tableId}`, "GET",);
}
export const markOrdersAsPaid = async (tableId) => {
  return await apiCall('orders', `markPaid/${tableId}`, 'POST',{});
};


export const updateTableStatus = async (tableId, status) => {
  return await apiCall('tables', 'updateStatus', 'PUT', { tableId, status });
};
export const getUserByTableId = async (tableId)=>{
  return await apiCall("users",`${tableId}/user`, "GET")
};

export const fetchUnpaidTableTotals = async () => {
  return await apiCall('tables', 'unpaidTotals', 'GET');
};




