import { Link } from "react-router-dom";
import classes from "../cssPages/Product.module.css";
import React, { useState } from 'react';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import ioecri from "../Components/pantalone.jpg"
import Popup from "../Components/Popup";
import { InputNumber } from 'primereact/inputnumber';


function ProductPage() {
    const [popupVisible, setPopupVisible] = useState(false);
    const openPopup = () => {
        setPopupVisible(true);
        setTimeout(() => {setPopupVisible(false);}, 1000);
    };

    const [quantity, setQuantity] = useState(1);

    const marca = "ciao";
    const images = [
        ioecri,
        '/placeholder.svg?height=600&width=400',
        '/placeholder.svg?height=600&width=400',
        '/placeholder.svg?height=600&width=400'
    ];
      
    const imageTemplate = (item) => {
        return (
            <img src={item} alt="Product" className={classes.productImage} />
        );
    };

    return (
        <div className={classes.container}>
            <Card className={classes.productCard}>
                <div className={classes.grid}>
                    <div>
                        <Carousel value={images} numVisible={1} numScroll={1} className={classes.carousel} itemTemplate={imageTemplate} />
                    </div>
                    
                        <div className={classes.headerContainer}>
                            <h1 className={classes.productTitle}>NOME PRODOTTO</h1>
                            <h1 className={classes.productPrice} > PREZZO PRODOTTO </h1>
                        </div>
                        <Link to={`/search/${marca}`} > {`${marca}`}</Link>
                        <p className={classes.productDescription}>
                            DESCRIZIONE DI QUESTO BELLISSIMO PRODOTTO
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil exercitationem placeat quod fugiat consectetur illum harum earum accusamus corrupti. Maxime quis esse in dolor vero rem pariatur sapiente quod ratione!
                        </p>
                    <div className={classes.buttonContainer}>
                    <InputNumber 
                        value={quantity} 
                        onValueChange={(e) => setQuantity(e.value)} 
                        min={1} 
                        max={10} 
                        showButtons 
                        className={classes.quantityInput}
                    />   
                        <Button label="Aggiungi al carrello" icon="pi pi-shopping-cart" className={classes.addToCartButton}  onClick={openPopup} />

                        <Popup visible={popupVisible} onHide={() => setPopupVisible(false)}>

                            {quantity>1? (<p> {quantity} prodotti aggiunti al carrello</p>) : (<p> {quantity} prodotto aggiunto al carrello</p>)}
                        </Popup>

                    </div>
                </div>
            </Card>
        </div>
    );
}

export default ProductPage;
