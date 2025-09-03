import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import CartContext from "../contexts/CartContext";

function Header() {
  const { user, signOut } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold tracking-tight hover:text-blue-200 transition-colors duration-200">
          Shoe Store
        </Link>
        <nav className="flex space-x-4 sm:space-x-6 items-center">
          <Link to="/" className="hover:text-blue-200 transition-colors duration-200">
            Home
          </Link>
          <Link to="/cart" className="relative hover:text-blue-200 transition-colors duration-200">
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart.length}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="hover:text-blue-200 transition-colors duration-200">
                Profile
              </Link>
              <Link to="/orders" className="hover:text-blue-200 transition-colors duration-200">
                Orders
              </Link>
              {user.role === "Admin" && (
                <Link to="/admin" className="hover:text-blue-200 transition-colors duration-200">
                  Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="hover:text-blue-200 transition-colors duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition-colors duration-200">
                Sign In
              </Link>
              <Link to="/register" className="hover:text-blue-200 transition-colors duration-200">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;