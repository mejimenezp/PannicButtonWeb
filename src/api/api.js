import axios from "axios";

const api = axios.create({
  baseURL: "https://panicbuttonback.onrender.com/api",
  //baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
