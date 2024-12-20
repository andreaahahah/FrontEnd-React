import React, { useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import axios from "axios";
import classes from "../cssPages/OrderPage.module.css";
import { useCart } from "../GlobalContext/CartContext";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../GlobalContext/AuthContext";
import { baseurl } from "../config";
import { LoadingContext } from "../GlobalContext/LoadingContext";
import { showToast } from "../ToastManager";

export default function OrdinaPage() {
  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);
  const { keycloak } = useContext(AuthContext);
  const { cartItems, clearCart, clearCartAfterError } = useCart();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);

  const handleLoading = () => {
    startLoading();
  };

  const endLoading = () => {
    stopLoading();
  };

  const token = keycloak?.token;
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
    handleLoading();

    axios
      .get(`${baseurl}/utente/getIndirizzo`, authHeader)
      .then((response) => {
        setAddresses(response.data);
      })
      

    axios
      .get(`${baseurl}/utente/getPagamento`, authHeader)
      .then((response) => {
        setPayments(response.data);
      })
     

    endLoading();
  }, [cartItems, navigate]);

  const [newAddress, setNewAddress] = useState({
    nazione: "",
    cap: "",
    città: "",
    via: "",
  });

  const [newPayment, setNewPayment] = useState({
    numeroCarta: "",
    nomeCarta: "",
    meseScadenza: "",
    annoScadenza: "",
    tipoCarta: "",
  });

  const handleAddressSelection = (addressId) => setSelectedAddress(addressId);
  const handlePaymentSelection = (paymentId) => setSelectedPayment(paymentId);

  const handleAddNewAddress = () => {
    if (
      newAddress.nazione &&
      newAddress.cap &&
      newAddress.città &&
      newAddress.via
    ) 
    if(!newAddress.cap || newAddress.cap.length!=5 || newAddress.cap<1 ){
      showToast.error(`Il cap non sembra essere vero`)
      return;
    }
    if(newAddress.città.length<1){
      console.log(`ecco il cap ${newAddress.cap}`)
      showToast.error(`La città non sembra esistere`)
      return;
    }
    if(newAddress.nazione.length<1){
      showToast.error(`La nazione non sembra esistere`)
      return;
    }
    if(newAddress.via.length<1){
      showToast.error(`La via non sembra esistere`)
      return;
    }
    {
      axios
        .post(
          `${baseurl}/utente/addIndirizzo`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              via: newAddress.via,
              citta: newAddress.città,
              cap: newAddress.cap,
              nazione: newAddress.nazione,
            },
          }
        )
        .catch((error)=>
          showToast.error(`${error.response.data}`)
        )
        .then((response) => {
          console.log(response.data);
          // Chiamata GET per aggiornare la lista degli indirizzi
          axios
            .get(`${baseurl}/utente/getIndirizzo`, authHeader)
            .then((response) => {
              setAddresses(response.data);
            })
            .catch((error) =>
              console.error("Errore nel caricamento degli indirizzi:", error)
            );

          setNewAddress({ nazione: "", cap: "", città: "", via: "" });
        })
       
    }
  };

  const handleAddNewPayment = () => {
    const { numeroCarta, nomeCarta, meseScadenza, annoScadenza, tipoCarta } =
      newPayment;

    if (!numeroCarta || numeroCarta.length<1) {
      showToast.error(`Quel numero carta non sembra corretto`)
      return;
    }
    if(!nomeCarta|| nomeCarta.length<1){
      showToast.error(`Quel nome non sembra esistere`)
      return;
    }
    if(!tipoCarta|| tipoCarta.length<1){
      showToast.error(`Quel tipo di carta non sembra esistere`)
      return;
    }
      if(!meseScadenza||meseScadenza<1 || meseScadenza>12){
        showToast.error(`Quel mese non sembra esistere`)
        return;
        
      }
      if(!annoScadenza|| annoScadenza<2024 || annoScadenza>2100){
          showToast.error(`L'anno di scadenza mi sembra strano`)
          return;
      }
      const dataScadenza = `${annoScadenza}-${meseScadenza.padStart(
        2,
        "0"
      )}-01`;

      axios
        .post(
          `${baseurl}/utente/addPagamento`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              n: numeroCarta,
              data: dataScadenza,
              tipo: tipoCarta,
              nome: nomeCarta,
            },
          }
        )
        .catch((error)=>
          showToast.error(`${error.response.data}`)
        )
        .then(() => {
          // Chiamata GET per aggiornare la lista dei pagamenti
          axios
            .get(`${baseurl}/utente/getPagamento`, authHeader)
            .then((response) => {
              setPayments(response.data);
            })
            .catch((error) =>
              console.error("Errore nel caricamento dei pagamenti:", error)
            );

          setNewPayment({
            numeroCarta: "",
            nomeCarta: "",
            meseScadenza: "",
            annoScadenza: "",
            tipoCarta: "",
          });
        })
        
    
  };

  const handleConferma = () => {
    if (!selectedAddress || !selectedPayment) {
      console.log(selectedAddress, selectedPayment);
      return;
    }

    const prodottoDTOList = cartItems.map((item) => ({
      id: item.id,
      quantita: item.quantity,
    }));

    const body = {
      prodottoDTOList: prodottoDTOList,
    };

    const ordineUrl = `${baseurl}/carrello/ordina?indirizzo=${selectedAddress}&pagamento=${selectedPayment}`;
    console.log(body);
    // Invio della richiesta POST
    axios
      .post(ordineUrl, body, authHeader)
      .then(() => {
        showToast.success(`Ordine Confermato`)
        clearCart();
        navigate("/");
      })
     .catch((error)=>{
          showToast.error(`${error.response.data}`)
          clearCartAfterError();
          navigate("/");
  });
  };

  return (
    <main>
      {isLoading && <Spinner />}
      {!isLoading && (
        <div className={classes.orderContainer}>
          <h2>Procedi all'Ordine</h2>

          {/* Indirizzi di Spedizione */}
          <section className={classes.section}>
            <h3>Indirizzi di Spedizione</h3>
            {addresses.map((address) => (
              <div key={address.id} className={classes.addressOption}>
                <RadioButton
                  value={address.id}
                  checked={selectedAddress === address.id}
                  onChange={() => handleAddressSelection(address.id)}
                />
                <label>
                  {`${address.via}, ${address.città} ${address.cap}, ${address.nazione}`}
                </label>
              </div>
            ))}
            <div className={classes.newAddressForm}>
              <input
                type="text"
                placeholder="Nazione"
                value={newAddress.nazione}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, nazione: e.target.value })
                }
                className={classes.newInput}
              />
              <input
                type="number"
                placeholder="CAP"
                value={newAddress.cap}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, cap: e.target.value })
                }
                className={classes.newInput}
              />
              <input
                type="text"
                placeholder="Città"
                value={newAddress.città}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, città: e.target.value })
                }
                className={classes.newInput}
              />
              <input
                type="text"
                placeholder="Via e numero civico"
                value={newAddress.via}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, via: e.target.value })
                }
                className={classes.newInput}
              />
              <Button
                label="Aggiungi Indirizzo"
                onClick={handleAddNewAddress}
                className={classes.addButton}
              />
            </div>
          </section>

          {/* Metodi di Pagamento */}
          <section className={classes.section}>
            <h3>Metodi di Pagamento</h3>
            {payments.map((payment) => (
              <div key={payment.id} className={classes.paymentOption}>
                <RadioButton
                  value={payment.idPagamento}
                  checked={selectedPayment === payment.idPagamento}
                  onChange={() => handlePaymentSelection(payment.idPagamento)}
                />
                <label>{`${payment.tipoCarta} - ${payment.nomeCarta}, ${payment.numeroCarta}, Scadenza: ${payment.dataScadenza}`}</label>
              </div>
            ))}
            <div className={classes.newPaymentForm}>
              <input
                type="number"
                placeholder="Numero Carta"
                value={newPayment.numeroCarta}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, numeroCarta: e.target.value })
                }
                className={classes.newInput}
              />
              <input
                type="text"
                placeholder="Nome Titolare"
                value={newPayment.nomeCarta}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, nomeCarta: e.target.value })
                }
                className={classes.newInput}
              />
              <input
                type="number"
                min="1"
                max="12"
                placeholder="Mese Scadenza"
                value={newPayment.meseScadenza}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, meseScadenza: e.target.value })
                }
                className={classes.newInput}
              />

              <input
                type="number"
                min="2024"
                placeholder="Anno Scadenza"
                value={newPayment.annoScadenza}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, annoScadenza: e.target.value })
                }
                className={classes.newInput}
              />

              <input
                type="text"
                placeholder="Tipo Carta. es: Visa, Mastercard"
                value={newPayment.tipoCarta}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, tipoCarta: e.target.value })
                }
                className={classes.newInput}
              />
              <Button
                label="Aggiungi Pagamento"
                onClick={handleAddNewPayment}
                className={classes.addButton}
              />
            </div>
          </section>

          <Button
            label="Conferma Ordine"
            onClick={handleConferma}
            className={classes.confirmButton}
          />
        </div>
      )}
    </main>
  );
}
