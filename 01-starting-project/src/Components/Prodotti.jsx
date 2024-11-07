import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import classes from "../ComponentsCss/Ricerca.module.css"

import axios from "axios";


export default function Prodotti({ searchText }){
    const [products, setProducts] = useState([]);
   

    useEffect(() => {
        const fetchProducts = async () => {
            if(searchText=="vetrina"){
                try {
                    const response = await axios.get("http://localhost:8080/prodotto/elencaVetrina");
                    setProducts(response.data); 
                } catch (error) {
                    console.error("Errore nel recupero dei prodotti:", error);
                }
            }
            else{
                try {
                    console.log("ci siamo")
                    const response = await axios.get(`http://localhost:8080/prodotto/getProdotti?prod=${searchText}`);
                    setProducts(response.data); 
                    console.log(response)
                    console.log("ci siamo2")
                } catch (error) {
                    console.error("Errore nel recupero dei prodotti:", error);
                }
            }
        };

        fetchProducts();
    }, []);

    
    return (
        <div className={classes["products-grid"]}>
        {products.map((product) => (
            
            <div className={classes["product-item"]}>
                
                <Link to={{ pathname: `/product/${product.id}` }} state={{ product }} key={product.id}>

                    <button   >
                        <img src={`/images/${product.immagini.split(',')[0]}`} alt={product.nome} />
                        <div className={classes["product-info"]}>
                            <h3>{product.nome}</h3>
                            <p style={{ fontWeight: 'bold' }}>${Number(product.prezzo).toFixed(2)}</p>
                            
                        </div>
                    </button>
                </Link>
            </div>
        ))}
    </div>
    );
}