import { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addToCart, updateCart, removeFromCart } from '../services/cartService';
import AuthContext from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const addItemToCart = async (item) => {
    await addToCart(item);
    fetchCart();
  };

  const updateItemQuantity = async (productId, quantity) => {
    await updateCart(productId, quantity);
    fetchCart();
  };

  const removeItemFromCart = async (productId) => {
    await removeFromCart(productId);
    fetchCart();
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItemToCart, updateItemQuantity, removeItemFromCart, total, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;