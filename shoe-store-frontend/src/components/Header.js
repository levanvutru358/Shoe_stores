import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../contexts/AuthContext';

function Header() {
  const { user, isAdmin, signOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="container py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-tight">
          <Link to="/" className="hover:text-indigo-400 transition-colors duration-300">
            Shoe Haven
          </Link>
        </h1>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-200 hover:text-indigo-400 transition-colors duration-300">
            Home
          </Link>
          <Link to="/cart" className="text-gray-200 hover:text-indigo-400 transition-colors duration-300">
            Cart
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="text-gray-200 hover:text-indigo-400 transition-colors duration-300">
                Profile
              </Link>
              <Link to="/orders" className="text-gray-200 hover:text-indigo-400 transition-colors duration-300">
                Orders
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-gray-200 hover:text-indigo-400 transition-colors duration-300">
                  Admin
                </Link>
              )}
              <button
                onClick={signOut}
                className="text-gray-200 hover:text-indigo-400 transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-200 hover:text-indigo-400 transition-colors duration-300">
                Login
              </Link>
              <Link to="/register" className="text-gray-200 hover:text-indigo-400 transition-colors duration-300">
                Register
              </Link>
            </>
          )}
        </nav>
        {/* Cart Icon & Hamburger */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="text-gray-200 hover:text-indigo-400 transition-colors duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </Link>
          <button
            className="md:hidden text-gray-200 hover:text-indigo-400 transition-colors duration-300"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-800 px-4 py-6">
          <div className="flex flex-col space-y-4">
            {['Home', 'Cart', ...(user ? ['Profile', 'Orders', ...(isAdmin ? ['Admin'] : [])] : ['Login', 'Register'])].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-gray-200 hover:text-indigo-400 transition-colors duration-300"
                onClick={toggleMenu}
              >
                {item}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  signOut();
                  toggleMenu();
                }}
                className="text-gray-200 hover:text-indigo-400 text-left transition-colors duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;