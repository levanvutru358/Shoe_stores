import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"; 

const banners = [
  { id: 1, img: "https://intphcm.com/data/upload/banner-shop-giay-dep.jpg", text: "Giảm giá 50% tất cả sản phẩm" },
  { id: 2, img: "https://intphcm.com/data/upload/banner-shop-giay-dep.jpg", text: "Hàng mới về - Mua ngay kẻo lỡ" },
  { id: 3, img: "https://intphcm.com/data/upload/banner-shop-giay-dep.jpg", text: "Miễn phí ship toàn quốc" }
];

const products = [
  { id: 1, name: "Giày Nike Air", price: 2500000, img: "https://intphcm.com/data/upload/poster-giay-dep-mat.jpg" },
  { id: 2, name: "Giày Adidas", price: 2200000, img: "https://intphcm.com/data/upload/poster-giay-dep-mat.jpg" },
  { id: 3, name: "Giày Puma", price: 1800000, img: "https://intphcm.com/data/upload/poster-giay-dep-mat.jpg" },
  { id: 4, name: "Giày Converse", price: 1200000, img: "https://intphcm.com/data/upload/poster-giay-dep-mat.jpg" },
];

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);

  // Tự động chuyển banner mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center p-4 md:p-6">
          <h1 className="text-3xl font-extrabold tracking-tight">TTD Shop</h1>
          <nav className="flex items-center gap-4 md:gap-8">
            <Link to="/" className="text-lg hover:text-yellow-300 transition duration-300">Home</Link>
            <Link to="/cart" className="text-lg hover:text-yellow-300 flex items-center gap-2 transition duration-300">
              <FaShoppingCart /> Giỏ hàng
            </Link>
            <Link to="/auth" className="text-lg hover:text-yellow-300 transition duration-300">Đăng nhập/Đăng ký</Link>
            <Link to="/logout" className="text-lg hover:text-yellow-300 transition duration-300">Đăng xuất</Link>
            <FaUserCircle size={30} className="cursor-pointer hover:text-yellow-300 transition duration-300" />
          </nav>
        </div>
      </header>

      {/* Banner Carousel */}
      <section className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
        <div className="relative w-full h-full transition-transform duration-500 ease-in-out">
          <img
            src={banners[currentBanner].img}
            alt="banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white text-center px-4 animate-fadeIn">
              {banners[currentBanner].text}
            </h2>
          </div>
        </div>

        {/* Nút lùi */}
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition duration-300"
        >
          <IoIosArrowBack size={24} className="text-gray-800" />
        </button>

        {/* Nút tiến */}
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition duration-300"
        >
          <IoIosArrowForward size={24} className="text-gray-800" />
        </button>

        {/* Dots điều hướng */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full ${
                currentBanner === index ? 'bg-white' : 'bg-white/50'
              } hover:bg-white transition duration-300`}
            />
          ))}
        </div>
      </section>

      {/* Danh sách sản phẩm */}
      <section className="container mx-auto py-12 flex-1">
        <h3 className="text-3xl font-bold mb-8 text-center text-gray-800">Sản phẩm mới</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white border rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-5">
                <h4 className="font-bold text-lg text-gray-800 truncate">{product.name}</h4>
                <p className="text-red-600 font-semibold text-lg mt-1">
                  {product.price.toLocaleString()} đ
                </p>
                <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 group-hover:scale-105">
                  Mua ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto text-center space-y-4">
          <p className="text-lg">📍 Địa chỉ: 123 Nguyễn Văn Cừ, Hà Nội</p>
          <p className="text-lg">📞 SĐT: 0123 456 789</p>
          <p className="text-lg">📧 Email: ttdshop@gmail.com</p>
          <div className="mt-4">
            <p className="text-sm">© 2025 TTD Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}