// (Giữ nguyên)
import axios from "axios";
import { getToken } from "./authService";

const API_BASE_URL = "https://localhost:5172/api/orders";

export async function placeOrder(orderData) {
  const token = getToken();
  const res = await axios.post(API_BASE_URL, orderData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getUserOrders() {
  const token = getToken();
  const res = await axios.get(API_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}