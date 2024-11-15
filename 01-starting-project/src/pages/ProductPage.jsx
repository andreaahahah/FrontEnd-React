import { Link, useLocation, useParams } from "react-router-dom";
import classes from "../cssPages/Product.module.css";
import React, { useContext, useEffect, useState } from "react";
import { Carousel } from "primereact/carousel";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import Popup from "../Components/Popup";
import { InputNumber } from "primereact/inputnumber";
import { useCart } from "../GlobalContext/CartContext";
import axios from "axios";
import { baseurl } from "../config";
import { LoadingContext } from "../GlobalContext/LoadingContext";
import Spinner from "../Components/Spinner";
import { AuthContext } from "../GlobalContext/AuthContext";


function ProductPage() {
  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);
  const { isAuthenticated, user, login, logout, keycloak } = useContext(AuthContext);
  const token = keycloak?.token;
  const authHeader = { 
    headers: { 
        Authorization: `Bearer ${token}`
    }
}
  const { prodotto } = useParams(); // prendo l'id del prodotto dal path così posso cercarlo

  const location = useLocation(); // prendo tutto il prodotto che mi è stato passato dalla pagina precedente

  const { product } = location.state || {};

  const [popupVisible, setPopupVisible] = useState(false);

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [fetchedProduct, setFetchedProduct] = useState(null);

  const handleLoading = () => {
    startLoading();
  };

  const endLoading = () => {
    stopLoading();
  };

  const prodottoId = Number(prodotto);

  //se il prodotto non mi è stato mandato dalla pagina precedente lo chiedo al back
  useEffect(() => {
    if (!product) {
      handleLoading();
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `${baseurl}/prodotto/getProdotto?prod=${prodottoId}`
          );

          // Decodifica le immagini Base64 e aggiungile all'oggetto prodotto
          const images = response.data.immagini
            .split(",")
            .map((image) => `data:image/jpeg;base64,${image}`);

          setFetchedProduct({ ...response.data, immagini: images });
        } catch (error) {
          console.error("Errore nel recupero del prodotto:", error);
        }
      };
      fetchProduct();
      endLoading();
    }
  }, [prodotto, product]);

  const currentProduct = product || fetchedProduct;

  if (!currentProduct) {
    // gestisci il caricamento
    return <Spinner/>;
  }

  const { nome, prezzo, marca, descrizione, immagini } = currentProduct;

  const openPopup = () => {
    if(isAuthenticated){
      
      axios.post(`${baseurl}/carrello/add?prodotto=${prodottoId}&quantita=${quantity}`, {}, authHeader).then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error("Errore nel caricamento degli ordini:", error);
    });
    }
    //aggiungi anche il prodotto al backend come dettaglio carrello se è autenticato
    //if autenticated allora manda i prod al back
    //senza else perchè tanto li aggiungi e basta al front
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
    <main className={isLoading ? blurred : ""}>
      {isLoading && <Spinner />}
      {!isLoading && (
        <div className={classes.container}>
          <Card className={classes.productCard}>
            <div>
              {immagini.length > 0 && (
                <Carousel
                  key={immagini.join()}
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
              <p className={classes.productDescription}>{descrizione}</p>
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

                <Popup
                  visible={popupVisible}
                  onHide={() => setPopupVisible(false)}
                >
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
      )}
    </main>
  );
}

export default ProductPage;
