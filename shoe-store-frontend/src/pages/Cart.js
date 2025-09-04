import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../contexts/CartContext';

function Cart() {
  const { cart, updateItemQuantity, removeItemFromCart, total } = useContext(CartContext);

  return (
    <div className="container py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Your Cart
      </h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Your cart is empty.{' '}
          <Link to="/" className="text-indigo-600 hover:text-indigo-700">
            Start shopping now!
          </Link>
        </p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => {
            if (!item.product) {
              console.warn(`Invalid cart item: ${JSON.stringify(item)}`);
              return null;
            }
            return (
              <div
                key={item.productId}
                className="flex items-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                <img
                  src={item.product.imageUrl || 'placeholder.jpg'}
                  alt={item.product.name || 'Product'}
                  className="w-24 h-24 object-cover rounded-lg mr-6"
                />
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.product.name || 'Unknown Product'}
                  </h3>
                  <p className="text-gray-600">
                    ${item.product.price ? item.product.price.toFixed(2) : 'N/A'}
                  </p>
                  <div className="flex items-center space-x-3 mt-2">
                    <button
                      onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                      className="btn-secondary"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-gray-700 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                      className="btn-secondary"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItemFromCart(item.productId)}
                  className="text-red-500 hover:text-red-600 font-medium"
                >
                  Remove
                </button>
              </div>
            );
          })}
          <div className="mt-8 text-right">
            <p className="text-xl font-semibold text-gray-800">
              Total: ${total.toFixed(2)}
            </p>
            <Link to="/checkout" className="btn-primary mt-4 inline-block">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;