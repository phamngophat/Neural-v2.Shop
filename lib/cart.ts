import { CartItem } from "./types";

const CART_KEY = "shopping-cart";

export type { CartItem }; // Re-export for backward compatibility if needed

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToCart = (product: Omit<CartItem, "quantity">, quantity: number = 1) => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex((item) => item.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const removeFromCart = (productId: number) => {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const updateQuantity = (productId: number, quantity: number) => {
  const cart = getCart();
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      // Remove if quantity is 0 or less
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const getCartCount = (): number => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};
