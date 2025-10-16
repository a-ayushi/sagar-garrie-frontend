import axios from "axios";

const API_URL = "http://localhost:8080/auth/login";

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(API_URL, { username, password }, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data; // { token, role }
  } catch (error) {
    if (error.response) throw new Error(error.response.data.message || "Invalid username or password");
    else throw new Error("Network error: Could not connect to server");
  }
};
