import axios from "axios";

const api = axios.create({
  baseURL: "https://shotlist.onrender.com/api",
  withCredentials: true,
});

export default api;
