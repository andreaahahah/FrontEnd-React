import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import { FileUpload } from 'primereact/fileupload';
import classes from '../cssPages/AdminPage.module.css';
import axios from 'axios';

export default function AdminPage() {
    const [productData, setProductData] = useState({
        nome: '',
        descrizione: '',
        prezzo: null,
        marca: '',
        quantita: null,
        vetrina: false,
        immagini: ''
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
        try {
            await axios.post('/api/prodotti', productData);
            // Reset the form after submission
            setProductData({
                nome: '',
                descrizione: '',
                prezzo: null,
                marca: '',
                quantita: null,
                vetrina: false,
                immagini: ''
            });
            alert('Prodotto aggiunto con successo!');
        } catch (error) {
            console.error('Errore durante il salvataggio del prodotto:', error);
        }
    };

    return (
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
            <Button label="Salva Prodotto" onClick={console.log("okay")} className={classes.saveButton} />
        </div>
    );
}
