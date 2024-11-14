import { useContext, useEffect } from "react";
import { AuthContext } from "../GlobalContext/AuthContext";
import axios from "axios";
import { baseurl } from "../config";

function CatalogoPage() {
    const { keycloak } = useContext(AuthContext);
    const token = keycloak?.token;
    const authHeader = { 
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"  // Garantisce che il backend interpreti il contenuto come JSON
        }
    };

    useEffect(() => {
        if (!token) return;
        const prodottoDTOList = [  // Cambiato il nome della lista
            { id: 303, quantita: 2 },
            { id: 352, quantita: 1 }
        ];

        // Definizione del body della richiesta con la struttura corretta
        const body = {
            prodottoDTOList: prodottoDTOList
        };


        // Recupera gli ordini dal backend
        axios.post(`${baseurl}/carrello/ordina?utente=1&indirizzo=1&pagamento=2`, body, authHeader)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error("Errore nel caricamento degli ordini:", error);
            });
    }, [token]);

    return (
        <h2> 
            catalogo 
        </h2>
    );
}

export default CatalogoPage;
