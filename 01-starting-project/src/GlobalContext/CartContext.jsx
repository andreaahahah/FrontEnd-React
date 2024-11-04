import React, { createContext, useContext, useState, useEffect } from 'react';


const CartContext = createContext();

export const CartProvider = ({ children }) => {

    // se c'erano gia prodotti li stengo, altrimenti è vuoto
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

  
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingProductIndex = prevItems.findIndex(item => item.id === product.id);
            if (existingProductIndex !== -1) {
                // se già c'è aggiorno e basta
                const updatedCart = [...prevItems];
                updatedCart[existingProductIndex].quantity += product.quantity;
                return updatedCart;
            }
            // altrimenti lo aggiungo nuovo
            return [...prevItems, product];
        });
    };

    const removeFromCart = (itemId) => {
        console.log(`Rimuovendo l'elemento con ID: ${itemId}`);
        setCartItems(prevItems => {
            const updatedItems = prevItems.filter(item => item.id !== itemId);
            console.log("Elementi aggiornati:", updatedItems);
            return updatedItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
