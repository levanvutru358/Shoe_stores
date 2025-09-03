import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../contexts/CartContext';

function Cart() {
  const { cart, updateItemQuantity, removeItemFromCart, total } = useContext(CartContext);

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Your Shopping Cart
      </h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Your cart is empty.{' '}
          <Link to="/products" className="text-blue-600 hover:underline">
            Start shopping now!
          </Link>
        </p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.productId || item.id}
              className="flex items-center bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg mr-6"
              />
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-lg">${item.price.toFixed(2)}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <button
                    onClick={() =>
                      updateItemQuantity(item.productId || item.id, item.quantity - 1)
                    }
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition-all duration-200"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-gray-700 font-medium">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateItemQuantity(item.productId || item.id, item.quantity + 1)
                    }
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition-all duration-200"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItemFromCart(item.productId || item.id)}
                className="text-red-500 hover:text-red-600 font-medium transition-all duration-200"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-8 text-right">
            <p className="text-xl font-semibold text-gray-800">
              Total: ${total.toFixed(2)}
            </p>
            <Link
              to="/checkout"
              className="mt-4 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;