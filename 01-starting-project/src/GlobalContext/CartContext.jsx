import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { baseurl } from "../config";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, keycloak } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const mapBackendToFrontend = (backendCart) => {
    return backendCart.map((item) => ({
      id: item.idProdotto.id,
      name: item.idProdotto.nome,
      quantity: item.quantità,
      price: item.prezzo,
      imageUrl: item.idProdotto.immagini
        ? `data:image/jpeg;base64,${item.idProdotto.immagini.split(",")[0]}`
        : null,
    }));
  };

  useEffect(() => {
    const syncCart = async () => {
      const savedCart = localStorage.getItem("cart");
      const localCart = savedCart ? JSON.parse(savedCart) : [];
  
      if (isAuthenticated) {
        try {
          const token = keycloak?.token;
  
          const response = await axios.get(`${baseurl}/carrello/elenca`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          const backendCart = response.data || [];
          const mappedBackendCart = mapBackendToFrontend(backendCart);
  
          let updatedCart = [...localCart];
  
          mappedBackendCart.forEach((backendItem) => {
            const localItemIndex = updatedCart.findIndex(
              (item) => item.id === backendItem.id
            );
            if (localItemIndex !== -1) {
              updatedCart[localItemIndex].quantity = backendItem.quantity;
            } else {
              updatedCart.push(backendItem);
            }
          });
  
          setCartItems(updatedCart);
          localStorage.setItem("cart", JSON.stringify(updatedCart));
        } catch (error) {
          console.error("Errore nel recupero del carrello dal backend:", error);
        }
      } else {
        setCartItems(localCart);
      }
    };
  
    syncCart();
  }, [isAuthenticated, keycloak]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProductIndex = prevItems.findIndex(
        (item) => item.id === product.id
      );
      if (existingProductIndex !== -1) {
        const updatedCart = [...prevItems];
        updatedCart[existingProductIndex].quantity += product.quantity;
        return updatedCart;
      }
      return [...prevItems, product];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== itemId);
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
