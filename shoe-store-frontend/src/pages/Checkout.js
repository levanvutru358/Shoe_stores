import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/orderService';
import CartContext from '../contexts/CartContext';
import { toast } from 'react-toastify';

function Checkout() {
  const { cart, total, fetchCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'CreditCard',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount: total,
      shippingAddress: formData.shippingAddress,
      paymentMethod: formData.paymentMethod,
    };
    try {
      await placeOrder(orderData);
      fetchCart();
      navigate('/orders');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="checkout-wrapper container py-12">
      <h2 className="checkout-title">THANH TOÁN</h2>

      <div className="checkout-content">
        {/* Bảng sản phẩm giống trang Cart */}
        <table className="checkout-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.productId}>
                <td>
                  <img
                    src={item.product.imageUrl || "placeholder.jpg"}
                    alt={item.product.name}
                    className="checkout-img"
                  />
                </td>
                <td className="product-name">{item.product.name}</td>
                <td>{item.quantity}</td>
                <td>{item.product.price.toLocaleString()}₫</td>
                <td>{(item.product.price * item.quantity).toLocaleString()}₫</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Form thông tin giao hàng + tổng tiền */}
        <div className="checkout-summary">
          <h3>Thông tin đơn hàng</h3>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label>Địa chỉ giao hàng</label>
              <input
                type="text"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                required
                placeholder="Nhập địa chỉ giao hàng"
              />
            </div>
            <div className="form-group">
              <label>Phương thức thanh toán</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="CreditCard">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="CashOnDelivery">Cash on Delivery</option>
              </select>
            </div>

            <div className="summary-box">
              <p>
                Thành tiền: <span>{total.toLocaleString()}₫</span>
              </p>
              <p className="summary-total">
                Tổng cộng: <span>{total.toLocaleString()}₫</span>
              </p>
            </div>

            <button type="submit" className="checkout-btn">
              ĐẶT HÀNG
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;