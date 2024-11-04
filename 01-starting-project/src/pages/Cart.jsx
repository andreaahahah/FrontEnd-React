import React, { useContext } from 'react';
import { useCart } from '../GlobalContext/CartContext'; 
import { Button } from 'primereact/button';
import classes from '../cssPages/Cart.module.css'; 
import { AuthContext } from '../GlobalContext/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function CartPage() {
    const { cartItems, clearCart, removeFromCart } = useCart(); 
    const { isAuthenticated, user, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCheckout = () => {
        //se è loggato fagli comprare, altrimenti no
        if(isAuthenticated){

        }else{
            navigate('/profile')
        }
    };

     
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className={classes.cartContainer}>
            <h2>Carrello</h2>
            {cartItems.length === 0 ? (
                <p>Il carrello è vuoto.</p>
            ) : (
                <div>
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={index} className={classes.cartItem}>
                                <div className={classes.productDetails}>
                                    <img src={item.imageUrl} alt={item.name} className={classes.productImage} /> {/* Immagine del prodotto */}
                                    <div className={classes.textDetails}>
                                        <h4>{item.name}</h4>
                                        <p>Prezzo: {item.price}€</p>
                                        <p>Quantità: {item.quantity}</p>
                                        <Button 
                                            label="Rimuovi" 
                                            onClick={() => removeFromCart(item.id)} 
                                            className={classes.removeButton} 
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className={classes.totalContainer}>
                        <h3>Totale: {calculateTotal()}€</h3> 
                    </div>
                    <div className={classes.buttonContainer}>
                    <Link to={isAuthenticated ? "/ordina" : "/profile"}>
                        <Button label="Procedi all'acquisto"  className={classes.checkoutButton} />
                    </Link>
                        
                            <Button label="Svuota carrello" onClick={clearCart} className={classes.clearButton} />
                       
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;
