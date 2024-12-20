import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import classes from "../ComponentsCss/Ricerca.module.css";
import { LoadingContext } from "../GlobalContext/LoadingContext";
import axios from "axios";
import { baseurl } from "../config";
import Spinner from "./Spinner";

export default function Prodotti({ searchText, tipo }) {
  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);

  const [products, setProducts] = useState([]);
  
  const handleLoading = () => {
    startLoading();
  };

  const endLoading = () => {
    stopLoading();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      handleLoading();
      
      try {
        let response;
        
        if (searchText === "vetrina") {
          response = await axios.get(`${baseurl}/prodotto/elencaVetrina`);
        } else if (tipo === "c") {
          response = await axios.get(`${baseurl}/prodottoCategoria/getProdotti?cate=${searchText}`);
        } else if (tipo === "m") {
          response = await axios.get(`${baseurl}/prodotto/elencaProdByMarca?marca=${searchText}`);
        } else {
          response = await axios.get(`${baseurl}/prodotto/getProdotti?prod=${searchText}`);
        }

        const productsWithImages = response.data.map(product => {
          // Decodifica le immagini Base64 
          const images = product.immagini.split(",").map(image => `data:image/jpeg;base64,${image}`);
          return { ...product, immagini: images };
        });

        setProducts(productsWithImages);
        endLoading();
      } catch (error) {
        console.error("Errore nel recupero dei prodotti:", error);
        endLoading();
      }
    };

    fetchProducts();
  }, [searchText, tipo]);

  return (
    <main >
      {isLoading && <Spinner/>
      }

      {!isLoading && (
        <div className={classes["products-grid"]}>
          {products.map((product) => (
            <div className={classes["product-item"]} key={product.id}>
              <Link to={{ pathname: `/product/${product.id}` }} state={{ product }}>
                <button>
                  <img
                    src={product.immagini[0]} // Usa la prima immagine decodificata
                    alt={product.nome}
                  />
                  <div className={classes["product-info"]}>
                    <h3>{product.nome}</h3>
                    <p style={{ fontWeight: "bold" }}>
                      ${Number(product.prezzo).toFixed(2)}
                    </p>
                  </div>
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {!isLoading && products.length <= 0 && (
        <div className={classes["noRes"]}>La ricerca non ha prodotto alcun risultato</div>
      )}
    </main>
  );
}
