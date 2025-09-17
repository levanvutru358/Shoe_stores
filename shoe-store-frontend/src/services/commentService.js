import axios from "axios";

const API_URL = "http://localhost:5172/api/comments";

// Lấy comment theo productId
export const getComments = async (productId) => {
  const res = await axios.get(`${API_URL}/product/${productId}`);
  return res.data;
};

// Tạo comment (yêu cầu token)
export const createComment = async (productId, content) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_URL}/${productId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Xóa comment (yêu cầu token)
export const deleteComment = async (commentId) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
