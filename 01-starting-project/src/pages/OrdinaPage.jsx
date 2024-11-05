//TODO deve essere autenticato per arrivare qui
//fai una chiamata http per vedere sia gli indirizzi dell'utente sia i suoi metodi di pagamento 

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import classes from '../cssPages/OrderPage.module.css';

export default function OrdinaPage(){
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const [newAddress, setNewAddress] = useState({
        nazione: '',
        cap: '',
        citta: '',
        via: '',
    });

    const [newPayment, setNewPayment] = useState({
        numeroCarta: '',
        nomeCarta: '',
        scadenza: '',
        tipoCarta: '',
    });
    
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            nazione: 'Italia',
            cap: '20100',
            citta: 'Milano',
            via: 'Via Roma 1',
        },
        {
            id: 2,
            nazione: 'Italia',
            cap: '10100',
            citta: 'Torino',
            via: 'Corso Venezia 45',
        },
    ]);

    const [payments, setPayments] = useState([
        { id: 1, numeroCarta: '**** **** **** 1234', nomeCarta: 'Mario Rossi', scadenza: '12/25', tipoCarta: 'Visa' },
        { id: 2, numeroCarta: '**** **** **** 5678', nomeCarta: 'Giulia Verdi', scadenza: '11/24', tipoCarta: 'MasterCard' },
    ]);

    const handleAddressSelection = (addressId) => setSelectedAddress(addressId);
    const handlePaymentSelection = (paymentId) => setSelectedPayment(paymentId);

    const handleAddNewAddress = () => {
        //il controllo che non esiste già lo faccio nel backend
        if (newAddress.nazione && newAddress.cap && newAddress.citta && newAddress.via) {
            const newAddressObj = { ...newAddress, id: Date.now() };
            setAddresses([...addresses, newAddressObj]);
            setNewAddress({ nazione: '', cap: '', citta: '', via: '' }); // resetto le caselle di input
        }
    };

    const handleAddNewPayment = () => {
        //il controllo che non esiste già lo faccio nel backend
        if (newPayment.numeroCarta && newPayment.nomeCarta && newPayment.scadenza && newPayment.tipoCarta) {
            const newPaymentObj = { 
                ...newPayment, 
                id: Date.now(),
                numeroCarta: `**** **** **** ${newPayment.numeroCarta.slice(-4)}` // Maschera il numero della carta
            };
            setPayments([...payments, newPaymentObj]);
            setNewPayment({ numeroCarta: '', nomeCarta: '', scadenza: '', tipoCarta: '' }); // resetto le caselle di input
        }
    };

    return (
        <div className={classes.orderContainer}>
            <h2>Procedi all'Ordine</h2>

            {/* indirizzi*/}
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
                            {`${address.via}, ${address.citta} ${address.cap}, ${address.nazione}`}
                        </label>
                    </div>
                ))}
                <div className={classes.newAddressForm}>
                    <input 
                        type="text" 
                        placeholder="Nazione" 
                        value={newAddress.nazione} 
                        onChange={(e) => setNewAddress({ ...newAddress, nazione: e.target.value })} 
                        className={classes.newInput}
                    />
                    <input 
                        type="number" 
                        placeholder="CAP" 
                        value={newAddress.cap} 
                        onChange={(e) => setNewAddress({ ...newAddress, cap: e.target.value })} 
                        className={classes.newInput}
                    />
                    <input 
                        type="text" 
                        placeholder="Città" 
                        value={newAddress.citta} 
                        onChange={(e) => setNewAddress({ ...newAddress, citta: e.target.value })} 
                        className={classes.newInput}
                    />
                    <input 
                        type="text" 
                        placeholder="Via e numero civico" 
                        value={newAddress.via} 
                        onChange={(e) => setNewAddress({ ...newAddress, via: e.target.value })} 
                        className={classes.newInput}
                    />
                    <Button label="Aggiungi Indirizzo" onClick={handleAddNewAddress} className={classes.addButton} />
                </div>
            </section>

            {/*  Pagamenti */}
            <section className={classes.section}>
                <h3>Metodi di Pagamento</h3>
                {payments.map((payment) => (
                    <div key={payment.id} className={classes.paymentOption}>
                        <RadioButton 
                            value={payment.id} 
                            checked={selectedPayment === payment.id} 
                            onChange={() => handlePaymentSelection(payment.id)} 
                        />
                        <label>{`${payment.tipoCarta} - ${payment.nomeCarta}, ${payment.numeroCarta}, Scadenza: ${payment.scadenza}`}</label>
                    </div>
                ))}
                <div className={classes.newPaymentForm}>
                    <input 
                        type="text" 
                        placeholder="Numero Carta" 
                        value={newPayment.numeroCarta} 
                        onChange={(e) => setNewPayment({ ...newPayment, numeroCarta: e.target.value })} 
                        className={classes.newInput}
                    />
                    <input 
                        type="text" 
                        placeholder="Nome Titolare" 
                        value={newPayment.nomeCarta} 
                        onChange={(e) => setNewPayment({ ...newPayment, nomeCarta: e.target.value })} 
                        className={classes.newInput}
                    />
                    <input 
                        type="text" 
                        placeholder="Data di Scadenza (MM/AA)" 
                        value={newPayment.scadenza} 
                        onChange={(e) => setNewPayment({ ...newPayment, scadenza: e.target.value })} 
                        className={classes.newInput}
                    />
                    <input 
                        type="text" 
                        placeholder="Tipo Carta (Visa, MasterCard...)" 
                        value={newPayment.tipoCarta} 
                        onChange={(e) => setNewPayment({ ...newPayment, tipoCarta: e.target.value })} 
                        className={classes.newInput}
                    />
                    <Button label="Aggiungi Pagamento" onClick={handleAddNewPayment} className={classes.addButton} />
                </div>
            </section>

            <Button label="Conferma Ordine" className={classes.confirmButton} />
        </div>
    );
}


