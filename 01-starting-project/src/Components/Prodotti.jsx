import React from 'react';
import { Link } from "react-router-dom";
import classes from "../ComponentsCss/Ricerca.module.css"
import ioecri from './ioecri.jpg';


export default function Prodotti(){
   

     const products = [
        { id: 1, title: "Prodotto 1", image: ioecri, description: "Descrizione prodotto 1", price: 10.99 },
        { id: 2, title: "Prodotto 2", image: ioecri, description: "Descrizione prodotto 2", price: 99999.99 },
        { id: 3, title: "Prodotto 3", image: ioecri, description: "Descrizione prodotto 3", price: 159.49 },
        { id: 4, title: "Prodotto 4", image: ioecri, description: "Descrizione prodotto 4", price: 98.99 },
        { id: 5, title: "Prodotto 5", image: "path/to/image5.jpg", description: "Descrizione prodotto 5", price: 290.00 },
        { id: 6, title: "Prodotto 6", image: "path/to/image6.jpg", description: "Descrizione prodotto 6", price: 5.99 },
        { id: 7, title: "Prodotto 7", image: "path/to/image7.jpg", description: "Descrizione prodotto 7", price: 7.49 },
        { id: 8, title: "Prodotto 8", image: "path/to/image8.jpg", description: "Descrizione prodotto 8", price: 14.99 },
        { id: 1, title: "Prodotto 1", image: ioecri, description: "Descrizione prodotto 1", price: 10.99 },
        { id: 2, title: "Prodotto 2", image: ioecri, description: "Descrizione prodotto 2", price: 99999.99 },
        { id: 3, title: "Prodotto 3", image: ioecri, description: "Descrizione prodotto 3", price: 159.49 },
        { id: 4, title: "Prodotto 4", image: ioecri, description: "Descrizione prodotto 4", price: 98.99 },
        { id: 5, title: "Prodotto 5", image: "path/to/image5.jpg", description: "Descrizione prodotto 5", price: 290.00 },
        { id: 6, title: "Prodotto 6", image: "path/to/image6.jpg", description: "Descrizione prodotto 6", price: 5.99 },
        { id: 7, title: "Prodotto 7", image: "path/to/image7.jpg", description: "Descrizione prodotto 7", price: 7.49 },
        { id: 8, title: "Prodotto 8", image: "path/to/image8.jpg", description: "Descrizione prodotto 8", price: 14.99 },
    ];
    
    return (
        <div className={classes["products-grid"]}>
        {products.map((product) => (
            <div className={classes["product-item"]}>
                <Link to= {`/product/${product.id}`} >
                    <button   key={product.id}>
                        <img src={product.image} alt={product.title} />
                        <div className={classes["product-info"]}>
                            <h3>{product.title}</h3>
                            <p>{product.description}</p>
                            <p style={{ fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
                            
                        </div>
                    </button>
                </Link>
            </div>
        ))}
    </div>
    );
}