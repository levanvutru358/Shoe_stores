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
    <div className="container py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h2>
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-6">Order Details</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Shipping Address</label>
            <input
              type="text"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              className="input-field"
              required
              placeholder="Enter shipping address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="CreditCard">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="CashOnDelivery">Cash on Delivery</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">
            Place Order - ${total.toFixed(2)}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;