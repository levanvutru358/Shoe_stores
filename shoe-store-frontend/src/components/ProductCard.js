import { useContext } from 'react';
import CartContext from '../contexts/CartContext';

function ProductCard({ shoe }) {
  const { addItemToCart } = useContext(CartContext);

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="relative">
        <img
          src={shoe.image}
          alt={shoe.name}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 truncate">{shoe.name}</h3>
        <p className="text-lg text-gray-600 mt-1">${shoe.price.toFixed(2)}</p>
        <button
          onClick={() => addItemToCart({ productId: shoe.id, quantity: 1 })}
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;