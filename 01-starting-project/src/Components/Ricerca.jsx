import Prodotti from "./Prodotti";
import classes from "../ComponentsCss/Ricerca.module.css";
import { LoadingContext } from "../GlobalContext/LoadingContext";
import { useContext, useEffect } from "react";
import spinnerStyles from "../ComponentsCss/Spinner.module.css";

export default function Ricerca({ testo }) {
    const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);

    const handleLoading = () => {
        startLoading();
        setTimeout(() => stopLoading(), 1000); // Simula il caricamento
    };

    useEffect(() => {
    }, [testo]); // Rende l'effetto reattivo al cambiamento di `testo`

    return (
        <main className={isLoading ? spinnerStyles.blurred : ''}>
            {isLoading && (
                <div className={spinnerStyles["spinner-overlay"]}>
                    <div className={spinnerStyles.spinner}></div>
                </div>
            )}
            {!isLoading && (
                <>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div className={classes["h2"]} style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                            Risultati per: <span style={{ fontWeight: 'normal' }}>{testo}</span>
                        </div>
                    </div>
                    <Prodotti searchText={testo} />
                </>
            )}
        </main>
    );
}
