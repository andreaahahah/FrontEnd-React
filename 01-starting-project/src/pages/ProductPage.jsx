import { Link, useLocation, useParams } from "react-router-dom";
import classes from "../cssPages/Product.module.css";
import React, { useEffect, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import Popup from "../Components/Popup";
import { InputNumber } from 'primereact/inputnumber';
import { useCart } from '../GlobalContext/CartContext';
import axios from "axios";

function ProductPage() {
  const { prodotto } = useParams(); // prendo l'id del prodotto dal path così posso cercarlo

  const location = useLocation(); // prendo tutto il prodotto che mi è stato passato dalla pagina precedente

  const { product } = location.state || {};

  const [popupVisible, setPopupVisible] = useState(false);

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [fetchedProduct, setFetchedProduct] = useState(null);

  const prodottoId = Number(prodotto);

  useEffect(() => {
    if (!product) {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/prodotto/getProdotto?prod=${prodottoId}`);
                
                // Decodifica le immagini Base64 e aggiungile all'oggetto prodotto
                const images = response.data.immagini.split(",").map(image => `data:image/jpeg;base64,${image}`);
                
                setFetchedProduct({ ...response.data, immagini: images });
            } catch (error) {
                console.error("Errore nel recupero del prodotto:", error);
            }
        };
        fetchProduct();
    }
  }, [prodotto, product]);

  const currentProduct = product || fetchedProduct;

  if (!currentProduct) {
    // gestisci il caricamento
    return <p>Caricamento prodotto...</p>;
  }

  const { nome, prezzo, marca, descrizione, immagini } = currentProduct;

  const openPopup = () => {
    addToCart({
      id: prodottoId,
      name: nome,
      quantity: quantity,
      price: prezzo,
      imageUrl: immagini[0], // Usa la prima immagine decodificata
    });
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 1000);
  };

  const imageTemplate = (item) => {
    return (
      <img
        src={item} // Ogni immagine è già decodificata
        alt="Product"
        className={classes.productImage}
      />
    );
  };

  return (
    <div className={classes.container}>
      <Card className={classes.productCard}>
        <div>
          {immagini.length > 0 && (
            <Carousel
              value={immagini}
              numVisible={1}
              numScroll={1}
              className={classes.carousel}
              itemTemplate={imageTemplate}
              autoplayInterval={5000}
              circular
            />
          )}

          <div className={classes.headerContainer}>
            <h1 className={classes.productTitle}>{nome}</h1>
            <h1 className={classes.productPrice}> €{prezzo.toFixed(2)}</h1>
          </div>
          <Link 
            to={`/search/${marca.nome}`}
            state={{ tipo: "m", nome: marca.nome }}
            key={marca.nome}
          >
            {`${marca.nome}`}
          </Link>
          <p className={classes.productDescription}>
            {descrizione}
          </p>
          <div className={classes.buttonContainer}>
            <InputNumber
              value={quantity}
              onValueChange={(e) => setQuantity(e.value)}
              min={1}
              max={9}
              showButtons
              className={classes.quantityInput}
            />
            <Button
              label="Aggiungi al carrello"
              icon="pi pi-shopping-cart"
              className={classes.addToCartButton}
              onClick={openPopup}
            />

            <Popup visible={popupVisible} onHide={() => setPopupVisible(false)}>
              {quantity > 1 ? (
                <p> {quantity} prodotti aggiunti al carrello</p>
              ) : (
                <p> {quantity} prodotto aggiunto al carrello</p>
              )}
            </Popup>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProductPage;
