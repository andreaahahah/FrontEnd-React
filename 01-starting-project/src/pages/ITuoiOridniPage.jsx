import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import axios from 'axios';
import classes from '../cssPages/OrdersPage.module.css';
import { AuthContext } from '../GlobalContext/AuthContext';
import { baseurl } from "../config";
import { LoadingContext } from '../GlobalContext/LoadingContext';
import Spinner from '../Components/Spinner';

export default function ITuoiOrdini() {
    const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);

    const { keycloak } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [sortedByDate, setSortedByDate] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false); // Stato per evitare loop infiniti
    const token = keycloak?.token;
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    const handleLoading = () => {
        startLoading();
      };
    
      const endLoading = () => {
        stopLoading();
      };

    useEffect(() => {
        handleLoading();
        // Recupera gli ordini dal backend
        axios.get(`${baseurl}/utente/ordini`, authHeader)
            .then(response => {
                // Ordina gli ordini dal più recente al più vecchio
                const sortedOrders = response.data.sort((a, b) => new Date(b.data) - new Date(a.data));
                setOrders(sortedOrders);
                setIsLoaded(true); // Segnala che i dati sono stati caricati
            })
            .catch(error => {
                console.error("Errore nel caricamento degli ordini:", error);
                setIsLoaded(true); // In caso di errore, comunque segna il caricamento come completo
            });
            endLoading();
    }, [token]); // Dipende dal token, quindi verrà rieseguito solo se cambia

    const handleSort = () => {
      if (orders.length === 0) return;
  
      // Crea una copia dell'array e ordina per data
      const sortedOrders = [...orders].sort((a, b) => {
          const dateA = new Date(a.data).getTime(); // Conversione in timestamp
          const dateB = new Date(b.data).getTime();
          return !sortedByDate ? dateB - dateA : dateA - dateB;
      });
  
      setOrders(sortedOrders);
      setSortedByDate(!sortedByDate);
  };
  
    return (
        <main>
        {isLoading && <Spinner />}
      {!isLoading && (
        <div className={classes.ordersContainer}>
            <h2>I tuoi Ordini</h2>
            <Button label={`Ordina per data (${sortedByDate ? 'Recenti' : 'Meno Recenti'})`} onClick={handleSort} className={classes.sortButton} />
            {!isLoaded ? (
                <p>Caricamento ordini...</p>
            ) : orders.length === 0 ? (
                <p>Non hai ancora effettuato ordini.</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order.idOrdine} className={classes.orderItem}>
                            <div className={classes.orderDetails}>
                                <p><strong>Data:</strong> {new Date(order.data).toLocaleDateString()}</p>
                                <p><strong>Totale:</strong> {order.totale}€</p>
                                <p><strong>Indirizzo di Spedizione:</strong> {order.idIndirizzo ? `${order.idIndirizzo.via}, ${order.idIndirizzo.città}, ${order.idIndirizzo.cap}, ${order.idIndirizzo.nazione}` : 'Indirizzo non disponibile'}</p>
                                <p><strong>Metodo di Pagamento:</strong> {order.idPagamento ? `${order.idPagamento.tipoCarta} - ${order.idPagamento.nomeCarta}` : 'Metodo di pagamento non disponibile'}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>)}
        
    </main>
    );
}
