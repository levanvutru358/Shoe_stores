import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo & Description */}
        <div>
          <h3 className="text-xl font-bold mb-4 hover:text-indigo-400 transition-colors duration-300">
            Shoe Haven
          </h3>
          <p className="text-gray-400">
            Your one-stop shop for stylish, high-quality footwear.
          </p>
        </div>
        {/* Navigation Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4 hover:text-indigo-400 transition-colors duration-300">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {['Home', 'Cart', 'Profile', 'Orders'].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase()}`}
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4 hover:text-indigo-400 transition-colors duration-300">
            Contact Us
          </h4>
          <p className="text-gray-400 mb-2">Email: support@shoehaven.vn</p>
          <p className="text-gray-400 mb-2">Phone: +84 123 456 789</p>
          <p className="text-gray-400">Address: 123 Shoe Street, Ho Chi Minh City</p>
        </div>
      </div>
      <div className="mt-8 text-center border-t border-gray-800 pt-4">
        <p className="text-gray-400">
          &copy; 2025 Shoe Haven. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;