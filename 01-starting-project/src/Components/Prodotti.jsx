import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import classes from "../ComponentsCss/Ricerca.module.css";
import { LoadingContext } from "../GlobalContext/LoadingContext";
import spinnerStyles from "../ComponentsCss/Spinner.module.css";

import axios from "axios";

export default function Prodotti({ searchText }) {
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
      if (searchText == "vetrina") {
        try {
          const response = await axios.get(
            "http://localhost:8080/prodotto/elencaVetrina"
          );
          setProducts(response.data);
          endLoading();
        } catch (error) {
          console.error("Errore nel recupero dei prodotti:", error);
        }
      } else {
        try {
          console.log(searchText);
          const response = await axios.get(
            `http://localhost:8080/prodotto/getProdotti?prod=${searchText}`
          );
          setProducts(response.data);
          endLoading();
        } catch (error) {
          console.error("Errore nel recupero dei prodotti:", error);
        }
      }
    };

    fetchProducts();
  }, [searchText]);

  return (
    <main className={isLoading ? spinnerStyles.blurred : ""}>
      {isLoading && (
        <div className={spinnerStyles["spinner-overlay"]}>
          <div className={spinnerStyles.spinner}></div>
        </div>
      )}

      {!isLoading && (
        <div className={classes["products-grid"]}>
          {products.map((product) => (
            <div className={classes["product-item"]}>
              <Link
                to={{ pathname: `/product/${product.id}` }}
                state={{ product }}
                key={product.id}
              >
                <button>
                  <img
                    src={`/images/${product.immagini.split(",")[0]}`}
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
        {!isLoading && products.length<=0 &&
          <div className={classes["noRes"]}>La ricerca non ha prodotto alcun resultato</div>
          }

    </main>
  );
}
