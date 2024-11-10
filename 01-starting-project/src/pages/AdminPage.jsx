import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import { FileUpload } from 'primereact/fileupload';
import classes from '../cssPages/AdminPage.module.css';
import axios from 'axios';
import { AuthContext } from '../GlobalContext/AuthContext';

export default function AdminPage() {
    const { isAuthenticated, userRoles, keycloak} = useContext(AuthContext);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !userRoles.includes("SuperAdmin")) {
            navigate('/'); // Reindirizza alla home page
        }
    }, [isAuthenticated, userRoles, navigate]);

    const [productData, setProductData] = useState({
        nome: '',
        descrizione: '',
        prezzo: null,
        marca: '',
        quantita: null,
        vetrina: false,
        immagini: '',
        categoria: '' // Aggiunto il campo categoria
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleVetrinaChange = (value) => {
        setProductData((prevData) => ({ ...prevData, vetrina: value }));
    };

    const handleFileUpload = (e) => {
        const filePaths = e.files.map(file => URL.createObjectURL(file));
        setProductData((prevData) => ({
            ...prevData,
            immagini: filePaths.join(',')
        }));
    };

    const handleSaveProduct = async () => {
        const descrizionePronta = encodeURIComponent(productData.descrizione);
        const token = keycloak?.token;
        try {
            await axios.post(`http://localhost:8081/prodotto/crea?p=${productData.prezzo}&q=${productData.quantita}&m=${productData.marca}&n=${productData.nome}&d=${descrizionePronta}&img="productData.immagini"&c=${productData.categoria}&v=${productData.vetrina}`,
                {}, // Invia un payload vuoto se non hai bisogno di altri dati nel corpo della richiesta
        {
          headers: {
            Authorization: `Bearer ${token}`, // Aggiungi il token nell'intestazione
          },
        }
            );
            // Reset the form after submission
            setProductData({
                nome: '',
                descrizione: '',
                prezzo: null,
                marca: '',
                quantita: null,
                vetrina: false,
                immagini: '',
                categoria: '' // Reset categoria
            });
            alert('Prodotto aggiunto con successo!');
        } catch (error) {
            console.error('Errore durante il salvataggio del prodotto:', error);
        }
    };

    return (
        <>
        {(isAuthenticated && userRoles.includes("SuperAdmin")) ? (
        <div className={classes.adminContainer}>
            <h2>Carica Nuovo Prodotto</h2>
            <div className={classes.formGroup}>
                <InputText 
                    name="nome" 
                    placeholder="Nome del prodotto" 
                    value={productData.nome} 
                    onChange={handleInputChange} 
                />
                <InputTextarea 
                    name="descrizione" 
                    placeholder="Descrizione" 
                    rows={4} 
                    value={productData.descrizione} 
                    onChange={handleInputChange} 
                />
                <InputNumber 
                    name="prezzo" 
                    placeholder="Prezzo" 
                    value={productData.prezzo} 
                    onValueChange={(e) => setProductData(prevData => ({ ...prevData, prezzo: e.value }))} 
                    mode="currency" 
                    currency="EUR" 
                />
                <InputText 
                    name="marca" 
                    placeholder="Marca" 
                    value={productData.marca} 
                    onChange={handleInputChange} 
                />
                <InputNumber 
                    name="quantita" 
                    placeholder="Quantità" 
                    value={productData.quantita} 
                    onValueChange={(e) => setProductData(prevData => ({ ...prevData, quantita: e.value }))} 
                />
                {/* Campo Categoria */}
                <InputText 
                    name="categoria" 
                    placeholder="Categoria" 
                    value={productData.categoria} 
                    onChange={handleInputChange} 
                />
                <div className={classes.radioGroup}>
                    <label>In Vetrina:</label>
                    <RadioButton 
                        name="vetrina" 
                        value={true} 
                        onChange={() => handleVetrinaChange(true)} 
                        checked={productData.vetrina === true} 
                    />
                    <label>Si</label>
                    <RadioButton 
                        name="vetrina" 
                        value={false} 
                        onChange={() => handleVetrinaChange(false)} 
                        checked={productData.vetrina === false} 
                    />
                    <label>No</label>
                </div>
                <FileUpload 
                    name="immagini" 
                    multiple 
                    customUpload 
                    auto 
                    accept="image/*" 
                    maxFileSize={1000000} 
                    onUpload={handleFileUpload} 
                />
            </div>
            <Button label="Salva Prodotto" onClick={handleSaveProduct} className={classes.saveButton} />
        </div>) : (null)}
        </>
    );
}
