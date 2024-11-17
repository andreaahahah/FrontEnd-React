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
          const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  
          // Invia ogni prodotto dal localStorage al backend
          for (const item of localCart) {
            const { id, quantity } = item;
  
            await axios.post(
              `${baseurl}/carrello/add?prodotto=${id}&quantita=${quantity}`,
              {},
              authHeader
            );
          }
  
          // Dopo aver inviato i prodotti, richiediamo il carrello dal backend
          const response = await axios.get(`${baseurl}/carrello/elenca`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          const backendCart = response.data || [];
          const mappedBackendCart = mapBackendToFrontend(backendCart);
  
          setCartItems(mappedBackendCart);
          localStorage.setItem("cart", JSON.stringify(mappedBackendCart));
        } catch (error) {
          console.error("Errore nel recupero o invio del carrello:", error);
        }
      } else {
        // Evita di reimpostare lo stato se è identico al contenuto di localStorage
        setCartItems((prevItems) => {
          if (JSON.stringify(prevItems) !== JSON.stringify(localCart)) {
            return localCart;
          }
          return prevItems;
        });
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

  const removeFromCart = async (itemId) => {
    try {
      const token = keycloak?.token;
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  
      // Invia la richiesta al backend per rimuovere il prodotto dal carrello
      await axios.post(
        `${baseurl}/carrello/rimuovi?prodotto=${itemId}`,
        {},
        authHeader
      );
  
      // Dopo aver rimosso l'elemento dal backend, aggiorniamo il carrello nel frontend
      
    } catch (error) {
      console.error("Errore durante la rimozione del prodotto dal carrello:", error);
    }
    finally{
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== itemId);
        localStorage.setItem("cart", JSON.stringify(updatedItems));
        return updatedItems;
      });
    }
  };
  

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const clearCartAfterError = async () => {
    setCartItems([]); // Pulisci lo stato locale del carrello
    localStorage.removeItem("cart"); // Pulisci il localStorage
  
    try {
      const token = keycloak?.token;
      if (token) {
        // Recupera il carrello dal backend per sincronizzare i dati
        const response = await axios.get(`${baseurl}/carrello/elenca`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data);
        //TODO mappalo bene quando lo metti nel carrello
        localStorage.setItem("cart", JSON.stringify(response.data));
        console.log("Carrello recuperato dopo l'errore:", response.data);
      }
    } catch (error) {
      console.error("Errore nel recupero del carrello dopo un errore:", error);
    }
  };
  
  

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, clearCartAfterError }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
