import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_API_URL;

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

export const loginUser = async (email, password) => {
  return await apiCall("users", "login", "POST", { email, password });
};