import axios from "axios";

// const token = JSON.parse(localStorage.getItem("Token"));
// console.log(token);

const api = axios.create({
  baseURL: "http://localhost:8000",
  // headers: { Authorization: `Bearer ${token}` },
});

export default api;
