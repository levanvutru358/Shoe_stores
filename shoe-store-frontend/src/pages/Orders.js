import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserOrders } from "../services/orderService";
import { toast } from "react-toastify";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getUserOrders();
      setOrders(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Your Orders
      </h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          You have no orders yet.{" "}
          <Link to="/" className="text-blue-600 hover:underline transition-all duration-200">
            Start shopping now!
          </Link>
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
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600 text-lg mb-2">
                Total: ${order.totalAmount.toFixed(2)}
              </p>
              <p className="text-gray-600 text-lg mb-4">
                Payment Method: {order.paymentMethod}
              </p>
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Products:
                </h4>
                <ul className="space-y-2">
                  {(order.items || []).map((item) => (
                    <li
                      key={item.productId}
                      className="flex justify-between items-center text-gray-600"
                    >
                      <span>
                        {item.productName} (x{item.quantity})
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