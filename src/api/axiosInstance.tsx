/** @format */

import axios from "axios";

const api = axios.create({
  baseURL: "https://example.com/api", // ganti sesuai base API kamu
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
