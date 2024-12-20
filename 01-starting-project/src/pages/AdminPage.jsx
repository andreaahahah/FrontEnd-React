import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import { FileUpload } from "primereact/fileupload";
import classes from "../cssPages/AdminPage.module.css";
import axios from "axios";
import { AuthContext } from "../GlobalContext/AuthContext";
import { useTranslation } from "react-i18next";
import { baseurl } from "../config";
import { showToast } from "../ToastManager";

export default function AdminPage() {
  const { isAuthenticated, userRoles, keycloak } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleError = () => {
    showToast.error("Errore nei dati inseriti!");
  };

  const handleSuccess = () => {
    showToast.success("Operazione completata con successo!");
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    if (!isAuthenticated || !userRoles.includes("SuperAdmin")) {
      navigate("/");
    }
  }, [isAuthenticated, userRoles, navigate]);

  const [productData, setProductData] = useState({
    nome: "",
    descrizione: "",
    prezzo: 0,
    marca: "",
    quantita: 0,
    vetrina: false,
    immagini: [],
    categoria: "",
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
    setProductData((prevData) => ({
      ...prevData,
      immagini: files,
    }));
  };

  const handleSaveProduct = async () => {
    
    if (
      !productData.nome ||
      !productData.descrizione ||
      
      !productData.marca ||
      
      !productData.categoria ||
      productData.immagini.length === 0
    ) {
      showToast.error("Devi riempire tutti i campi");;
      return;
    }
    if(productData.prezzo <= 0 ){
      showToast.error("Alza il prezzo, non facciamo regali");
      return;
    }
    if(productData.quantita <= 0 ){
      showToast.error("La quantità dovrebbe essere maggiore di 0");
      return;
    }

    const formData = new FormData();
    productData.immagini.forEach((file) => {
      formData.append("files", file);
    });

    const params = `p=${productData.prezzo}&q=${productData.quantita}&m=${productData.marca}&n=${productData.nome}&d=${productData.descrizione}&c=${productData.categoria}&v=${productData.vetrina}`;
    const token = keycloak?.token;

    try {
      const response = await axios.post(
        `${baseurl}/prodotto/crea?${params}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        showToast.success("Prodoto inserito correttamente");;
        setProductData({
          nome: "",
          descrizione: "",
          prezzo: 0,
          marca: "",
          quantita: 0,
          vetrina: false,
          immagini: [],
          categoria: "",
        });
        navigate("/");
      } 
    } catch (error) {
      console.log(error)
      showToast.error(`${error.response.data}`);
      
    }
  };

  return (
    <>
      {isAuthenticated && userRoles.includes("SuperAdmin") ? (
        <>
          <div className={classes.selectContainer}>
            <select value={selectedLanguage} onChange={handleLanguageChange}>
              <option value="en">English</option>
              <option value="it">Italiano</option>
            </select>
          </div>
          <div className={classes.adminContainer}>
            <h2>{t("adminPage.title")}</h2>
            <div className={classes.formGroup}>
              <InputText
                name="nome"
                placeholder={t("adminPage.productName")}
                value={productData.nome}
                onChange={handleInputChange}
                className={classes.textAreaWithPadding}
              />
              <InputTextarea
                name="descrizione"
                placeholder={t("adminPage.productDescription")}
                rows={4}
                value={productData.descrizione}
                onChange={handleInputChange}
                className={classes.textAreaWithPadding}
              />

              <InputNumber
                name="prezzo"
                placeholder={t("adminPage.price")}
                value={productData.prezzo}
                onValueChange={(e) =>
                  setProductData((prevData) => ({
                    ...prevData,
                    prezzo: e.value,
                  }))
                }
                mode="currency"
                currency="EUR"
                minFractionDigits={0}
                maxFractionDigits={0}
              />

              <InputText
                name="marca"
                placeholder={t("adminPage.brand")}
                value={productData.marca}
                onChange={handleInputChange}
                className={classes.textAreaWithPadding}
              />
              <InputNumber
                name="quantita"
                placeholder={t("adminPage.quantity")}
                value={productData.quantita}
                onValueChange={(e) =>
                  setProductData((prevData) => ({
                    ...prevData,
                    quantita: e.value,
                  }))
                }
              />
              <InputText
                name="categoria"
                placeholder={t("adminPage.category")}
                value={productData.categoria}
                onChange={handleInputChange}
                className={classes.textAreaWithPadding}
              />
              <div className={classes.radioGroup}>
                <label>{t("adminPage.isInShowcase")}:</label>
                <RadioButton
                  name="vetrina"
                  value={true}
                  onChange={() => handleVetrinaChange(true)}
                  checked={productData.vetrina === true}
                />
                <label>{t("adminPage.yes")}</label>
                <RadioButton
                  name="vetrina"
                  value={false}
                  onChange={() => handleVetrinaChange(false)}
                  checked={productData.vetrina === false}
                />
                <label>{t("adminPage.no")}</label>
              </div>
              <FileUpload
                name="immagini"
                multiple
                auto
                accept="image/*"
                maxFileSize={1000000}
                onSelect={handleFileUpload}
                chooseOptions={{ className: classes.fileUploadButton }}
              />
            </div>
            <Button
              label={t("adminPage.saveButton")}
              onClick={handleSaveProduct}
              className={classes.saveButton}
            />
          </div>
        </>
      ) : null}
    </>
  );
}
