import axios from "axios";

const client = axios.create({
  baseURL: "http://127.0.0.1:3210/v1/",
  maxBodyLength: Infinity,
  headers: { "Content-Type": "application/json" },
});

export default client;
