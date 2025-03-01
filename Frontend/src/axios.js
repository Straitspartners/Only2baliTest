// src/api/axios.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000", // Change to your backend URL
//   timeout: 10000, // 10 seconds timeout
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Interceptor to handle errors globally
// api.interceptors.response.use(
//   response => response,
//   error => {
//     console.error("API Error:", error);
//     return Promise.reject(error);
//   }
// );

// export default api;


// src/api/axios.js
import axios from "axios";
// const baseURL = "http://localhost:5000"

const baseURL = "http://127.0.0.1:8000/"

const api = axios.create({
  baseURL: baseURL, // Change to your backend URL
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
