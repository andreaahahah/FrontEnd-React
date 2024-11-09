import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../GlobalContext/AuthContext'; // Assicurati che il contesto sia importato

export default function iTuoiOrdini() {
  const { keycloak } = useContext(AuthContext);

  const makeRequest = async () => {
    try {
      const token = keycloak?.token; // Ottieni il token JWT

      const response = await axios.get(`http://localhost:8081/solotoken`, {
        headers: {
          Authorization: `Bearer ${token}`, // Aggiungi il token nell'intestazione
        },
      });

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
