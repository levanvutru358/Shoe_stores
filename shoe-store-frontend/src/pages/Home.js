import { useState, useEffect } from "react";
import ProductList from "../components/ProductList";

function Home() {
  const [search, setSearch] = useState("");

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Welcome to Shoe Store
      </h2>
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
        />
      </div>
      <ProductList search={search} />
    </div>
  );
}

export default Home;