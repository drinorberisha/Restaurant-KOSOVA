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

