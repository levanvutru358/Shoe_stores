import { useState } from 'react';
import ProductList from '../components/ProductList';

function Home() {
  const [search, setSearch] = useState('');

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Discover Your Perfect Pair
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Explore our collection of stylish, high-quality footwear for every occasion.
        </p>
        <div className="max-w-md mx-auto mt-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for shoes..."
            className="input-field"
          />
        </div>
      </div>
      <ProductList search={search} />
    </div>
  );
}

export default Home;