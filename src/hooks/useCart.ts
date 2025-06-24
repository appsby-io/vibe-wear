import { useState, useCallback } from 'react';
import { CartItem } from '../types/cart';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: Omit<CartItem, 'id' | 'totalPrice'>) => {
    const newItem: CartItem = {
      ...item,
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      totalPrice: item.unitPrice * item.quantity,
    };

    setCartItems(prev => {
      // Check if same design with same specs already exists
      const existingItemIndex = prev.findIndex(
        existing => 
          existing.designId === item.designId &&
          existing.product === item.product &&
          existing.color === item.color &&
          existing.size === item.size
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updated = [...prev];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + item.quantity,
          totalPrice: updated[existingItemIndex].unitPrice * (updated[existingItemIndex].quantity + item.quantity),
        };
        return updated;
      } else {
        // Add new item
        return [...prev, newItem];
      }
    });

    return newItem.id;
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  };
};