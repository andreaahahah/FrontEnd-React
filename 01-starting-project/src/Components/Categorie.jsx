import React, { useContext, useEffect, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import { baseurl } from "../config";
import classes from "../ComponentsCss/Categories.module.css"
import axios from 'axios';
import { LoadingContext } from '../GlobalContext/LoadingContext';
import { Link } from 'react-router-dom';




export default function Categorie() {
    const [categorie, setCategorie] = useState([]);
    const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);


    const responsiveOptions = [
        { breakpoint: '1400px', numVisible: 2, numScroll: 1 },
        { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
        { breakpoint: '767px', numVisible: 2, numScroll: 1 },
        { breakpoint: '575px', numVisible: 1, numScroll: 1 },
    ];

    const handleLoading = () => {
        startLoading();
      };
    
      const endLoading = () => {
        stopLoading();
      };

      useEffect(() => {
        const fetchCategorie = async () => {
            handleLoading();
            try {
                console.log("Recupero delle categorie in corso...");
                const response = await axios.get(`${baseurl}/prodottoCategoria/elenca`);
                //header autorization Bearer token
                setCategorie(response.data);
            } catch (error) {
                console.error("Errore nel recupero delle categorie:", error);
            } finally {
                endLoading(); 
            }
        };

        fetchCategorie();
    }, []);



    const productTemplate = (categorie) => (
        
        <Link
            to={{ pathname: `/search/${categorie.nome}` }}
            state={{ tipo: "c", nome: categorie.id_categoria }}
            key={categorie.id_categoria}
            
        >
            <div className="border-1 surface-border border-round m-2 text-center py-5 px-3 transition-transform transform hover:scale-105">
                <button className={classes["cate-button"]}>
                <div className="mb-3">
                    <img src={`/images/categorie/${categorie.descrizione}`} alt={categorie.nome} style={{ width: '150px', height: 'auto' }} className="w-6 shadow-2" />
                
                </div>
                <div>
                    <h4 className="mb-1">{categorie.nome}</h4>
                    
                </div>
                </button>
            </div>
        </Link>

    );

    //metti lo spinner quando cairca
    return (
        <div className="card">
            {categorie.length > 0 ? (

                <div className={classes["carousel-container"]}> 
                <Carousel 
                    value={categorie} 
                    numVisible={5} 
                    numScroll={1} 
                    responsiveOptions={responsiveOptions} 
                    className={classes["custom-carousel"]} 
                    circular 
                    autoplayInterval={3000} 
                    itemTemplate={productTemplate} 
                />
                </div>

            ) : (
                <div className="text-center py-5">
                    <h5>nessuna categoria</h5>
                </div>
            )}
        </div>
    );
}
