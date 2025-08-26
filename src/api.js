import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change to deployed backend URL on Render
});

export default api;
