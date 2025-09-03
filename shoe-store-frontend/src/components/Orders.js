import { useState, useEffect } from 'react';
import { getUserOrders } from '../services/orderService';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getUserOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Your Orders
      </h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          You have no orders yet.{' '}
          <a href="/products" className="text-blue-600 hover:underline">
            Start shopping now!
          </a>
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Order #{order.id}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Delivered'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600 text-lg mb-4">
                Total: ${order.totalAmount.toFixed(2)}
              </p>
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Products:
                </h4>
                <ul className="space-y-2">
                  {order.items &&
                    order.items.map((item) => (
                      <li
                        key={item.productId || item.id}
                        className="flex justify-between items-center text-gray-600"
                      >
                        <span>
                          {item.name} (x{item.quantity})
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;