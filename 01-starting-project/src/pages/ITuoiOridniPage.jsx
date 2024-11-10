import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../GlobalContext/AuthContext'; // Assicurati che il contesto sia importato

export default function iTuoiOrdini() {
  const { keycloak } = useContext(AuthContext);

  const makeRequest = async () => {
    try {
      const token = keycloak?.token; // Ottieni il token JWT
  
      const response = await axios.post(
        `http://localhost:8081/prodotto/crea?p=39&q=10&m=levis&n=pantalone&d=pantalone%20jeans%20uomo%20perfetto%20per%20l'%20inverbo&img=path/image&c=pantaloni%20uomo`,
        {}, // Invia un payload vuoto se non hai bisogno di altri dati nel corpo della richiesta
        {
          headers: {
            Authorization: `Bearer ${token}`, // Aggiungi il token nell'intestazione
          },
        }
      );
  
      console.log(response.data); // Gestisci la risposta
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  // Chiamare makeRequest quando il componente è montato
  useEffect(() => {
    makeRequest();
  }, [keycloak]); // Effettua la richiesta solo quando keycloak è disponibile

  return (
    <div>
      QUI CI SONO I TUOI ORDINI
    </div>
  );
}
