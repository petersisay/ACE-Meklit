import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('aceMeklitCart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('aceMeklitCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const addToCart = (product, quantity = 1) => {
    const maxStock = typeof product.countInStock === 'number' ? product.countInStock : 99;
    if (maxStock <= 0) {
      showNotification(`"${product.name}" is currently out of stock!`, 'error');
      return;
    }

    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x._id === product._id);
      if (existItem) {
        if (existItem.qty >= maxStock) {
          showNotification(`Cannot add more. Maximum available stock (${maxStock}) reached for "${product.name}".`, 'info');
          return prevItems;
        }
        const newQty = Math.min(existItem.qty + quantity, maxStock);
        showNotification(`Updated quantity of "${product.name}" in your cart!`);
        return prevItems.map((x) =>
          x._id === product._id ? { ...x, qty: newQty, countInStock: maxStock } : x
        );
      } else {
        const initialQty = Math.min(quantity, maxStock);
        showNotification(`Added "${product.name}" to your cart!`);
        return [...prevItems, { ...product, qty: initialQty, countInStock: maxStock }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === productId) {
          const maxStock = typeof item.countInStock === 'number' ? item.countInStock : 99;
          const cappedQty = Math.min(qty, maxStock);
          return { ...item, qty: cappedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((x) => x._id === productId);
      if (item) {
        showNotification(`Removed "${item.name}" from cart.`, 'info');
      }
      return prevItems.filter((x) => x._id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  const value = {
    cartItems,
    notification,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
