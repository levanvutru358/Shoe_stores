import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/orderService';
import CartContext from '../contexts/CartContext';

function Checkout() {
  const { cart, total, fetchCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      items: cart,
      totalAmount: total,
      shippingAddress: formData.address,
    };
    try {
      await placeOrder(orderData);
      alert('Order placed successfully!');
      fetchCart();
      navigate('/orders');
    } catch (err) {
      alert('Error placing order');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>
      <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Credit Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium">Expiration Date</label>
              <input
                type="text"
                name="expiration"
                value={formData.expiration}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="MM/YY"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">CVV</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <button type="submit" className="mt-6 w-full bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;