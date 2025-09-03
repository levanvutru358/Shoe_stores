import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import ProductCard from './ProductCard';
import { getProducts } from '../services/productService';

function ProductList() {
  const [shoes, setShoes] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts(search);
      setShoes(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Our Collection
      </h2>
      <div className="mb-8 max-w-lg mx-auto">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {shoes.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">
            No products found.
          </p>
        ) : (
          shoes.map((shoe) => (
            <ProductCard key={shoe.id} shoe={shoe} />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;