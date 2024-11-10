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
    const { isAuthenticated, userRoles, keycloak } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !userRoles.includes("SuperAdmin")) {
            navigate('/'); // Reindirizza alla home page se l'utente non è autenticato o non ha il ruolo
        }
    }, [isAuthenticated, userRoles, navigate]);

    const [productData, setProductData] = useState({
        nome: '',
        descrizione: '',
        prezzo: null,
        marca: '',
        quantita: null,
        vetrina: false,
        immagini: [],
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
        const files = e.files;
        console.log("File selezionati:", files);
        setProductData((prevData) => ({
            ...prevData,
            immagini: files
        }));
    };

    const handleSaveProduct = async () => {
        // Crea un oggetto FormData per inviare solo le immagini
        const formData = new FormData();
    
        // Aggiungi le immagini al FormData
        if (productData.immagini.length > 0) {
            productData.immagini.forEach((file, index) => {
                formData.append("files", file);
            });
        } else {
            console.error("Nessuna immagine selezionata.");
            return;
        }
    
        // Prepara i parametri nel path o come query
        const params = `p=${productData.prezzo}&q=${productData.quantita}&m=${productData.marca}&n=${productData.nome}&d=${productData.descrizione}&c=${productData.categoria}&v=${productData.vetrina}`;
    
        const token = keycloak?.token;
    
        try {
            // Aggiungi i parametri al path URL
            const response = await axios.post(`http://localhost:8081/prodotto/crea?${params}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.status === 200) {
                alert('Prodotto aggiunto con successo!');
                // Reset del form dopo il salvataggio
                setProductData({
                    nome: '',
                    descrizione: '',
                    prezzo: null,
                    marca: '',
                    quantita: null,
                    vetrina: false,
                    immagini: [],
                    categoria: ''
                });
            } else {
                console.error("Errore nella risposta del server:", response);
                alert("Si è verificato un errore durante il salvataggio del prodotto.");
            }
        } catch (error) {
            console.error('Errore durante il salvataggio del prodotto:', error);
            alert("Errore durante il salvataggio del prodotto.");
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
                            onSelect={handleFileUpload}
                        />
                    </div>
                    <Button label="Salva Prodotto" onClick={handleSaveProduct} className={classes.saveButton} />
                </div>
            ) : null}
        </>
    );
}
