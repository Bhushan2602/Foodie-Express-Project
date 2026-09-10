import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast'; 

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('foodie_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('foodie_cart', JSON.stringify(cart));
  }, [cart]);

  // ✅ STRICT SINGLE-CITY POLICY LOGIC
  const addToCart = (item, restaurantName, city) => { 
    
    // 1. If cart has items, check if the CITY is different
    if (cart.length > 0 && cart[0].city !== city) {
      toast((t) => (
        <div className="flex flex-col gap-4">
          <div className="text-sm text-gray-800 leading-relaxed">
            Your cart contains food from <span className="font-black text-orange-600">{cart[0].city}</span>. 
            <br/><br/>
            Would you like to clear your cart to order from <span className="font-black text-orange-600">{city}</span> instead?
          </div>
          
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                toast.dismiss(t.id); 
                // Clear old cart and add new item with its city
                const cartItem = { ...item, restaurantName, city, cartId: Date.now() }; 
                setCart([cartItem]);
                toast.success(`Cart cleared! Added ${item.name} from ${city} 🍔`);
              }}
              className="bg-orange-500 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-orange-600 transition flex-1 shadow-md shadow-orange-200"
            >
              Yes, Clear Cart
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toast("Okay, kept your original cart!", { icon: '🛒' });
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-200 transition flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ), { duration: 10000, position: 'top-center' });
      
      return; // Stop execution!
    }

    // 2. Normal add logic (Allows different restaurants, as long as city matches)
    const cartItem = { ...item, restaurantName, city, cartId: Date.now() }; 
    setCart((prev) => [...prev, cartItem]);
    toast.success(`Added ${item.name} from ${restaurantName}!`);
  };

  const removeOneFromCart = (itemId) => {
    const index = cart.findIndex(cartItem => cartItem.id === itemId);
    if (index > -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const deleteItemTypeFromCart = (itemId) => {
    setCart(cart.filter(cartItem => cartItem.id !== itemId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeOneFromCart, deleteItemTypeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);