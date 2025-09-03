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
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl font-bold">
          <Link to="/" className="hover:text-blue-400 transition-all duration-200">
            Shoe Store
          </Link>
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-300 hover:text-white transition-all duration-200">
            Home
          </Link>
          <Link to="/cart" className="text-gray-300 hover:text-white transition-all duration-200">
            Cart
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="text-gray-300 hover:text-white transition-all duration-200">
                Profile
              </Link>
              <Link to="/orders" className="text-gray-300 hover:text-white transition-all duration-200">
                Orders
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-gray-300 hover:text-white transition-all duration-200">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={signOut}
                className="text-gray-300 hover:text-white transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition-all duration-200">
                Login
              </Link>
              <Link to="/register" className="text-gray-300 hover:text-white transition-all duration-200">
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Cart Icon */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="text-gray-300 hover:text-white transition-all duration-200">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </Link>

          {/* Hamburger Menu Button for Mobile */}
          <button
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-800 px-4 py-6">
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-all duration-200"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/cart"
              className="text-gray-300 hover:text-white transition-all duration-200"
              onClick={toggleMenu}
            >
              Cart
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-white transition-all duration-200"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-300 hover:text-white transition-all duration-200"
                  onClick={toggleMenu}
                >
                  Orders
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-300 hover:text-white transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    toggleMenu();
                  }}
                  className="text-gray-300 hover:text-white text-left transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-all duration-200"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-300 hover:text-white transition-all duration-200"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;