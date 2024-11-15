import { useContext, useEffect } from "react";
import { AuthContext } from "../GlobalContext/AuthContext";
import axios from "axios";
import { baseurl } from "../config";

function CatalogoPage() {
    const { keycloak } = useContext(AuthContext);
    const token = keycloak?.token;

    useEffect(() => {
        if (!token) {
            
            return;}

        const fetchCarrello = async () => {
            try {
                console.log(`${baseurl}/carrello/elenca`)
                const response = await axios.get(`${baseurl}/carrello/elenca`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Dati del carrello:", response.data);
            } catch (error) {
                console.error("Errore nel recupero del carrello:", error);
            }
        };

        fetchCarrello();
    }, [token]);

    return (
        <h2>Catalogo</h2>
    );
}

export default CatalogoPage;
