import Prodotti from "./Prodotti";
import classes from "../ComponentsCss/Ricerca.module.css";
import { LoadingContext } from "../GlobalContext/LoadingContext";
import { useContext, useEffect } from "react";
import spinnerStyles from "../ComponentsCss/Spinner.module.css";
import { useLocation, useParams } from "react-router-dom";

export default function Ricerca() {
    const { searchText } = useParams();

    const location = useLocation();
    const { tipo, nome } = location.state || {};

    useEffect(() => {
    }, [searchText]); //così cambia quando cambia il testo

    return (
        
                <>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div className={classes["h2"]} style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                            Risultati per: <span style={{ fontWeight: 'normal' }}>{searchText}</span>
                        </div>
                    </div>
                    {tipo?<Prodotti searchText={nome} tipo={tipo} />: <Prodotti searchText={searchText} />}
                </>
            
    );
}
