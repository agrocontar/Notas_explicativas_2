import axios from "axios";

const api = axios.create({
  baseURL: process.env.SERVER || "http://localhost:8000", 
  withCredentials: true,

});

export default api;