import { Link, Outlet, useNavigate } from "react-router-dom";
import classes from "../ComponentsCss/Icone.module.css";
import { useContext, useState } from "react";
import { AuthContext } from "../GlobalContext/AuthContext";

function RootLayout() {
  const { isAuthenticated, user, login, logout, userRoles } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const navigate = useNavigate();

  function handleVisibile() {
    setIsVisible((isVisible) => !isVisible);
  }

  function handleChange(event) {
    setInputText(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && inputText !== "") {
      handleVisibile();
      navigate(`/search/${inputText}`); //passo il testo cercato nel percorso
    }
  }

  return (
    <>
      <header>
        <Link to="/" className="custom-link">
          <div className="header-content">
            <h1 className="site-title">●STOCK HOUSE●</h1>
          </div>
        </Link>

        <div className={classes["button-container"]}>
          
          {isAuthenticated && userRoles.includes("SuperAdmin")&& (
            <Link to="/admin/products">
              <button className={classes["custom-button"]}>
                AGGIUNGI UN PRODOTTO
              </button>
            </Link>
          )}

          {isVisible && (
            <input
              type="text"
              className={classes["modern-input"]}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          )}

          <button className={classes["icon-button"]} onClick={handleVisibile}>
            <img
              src="/images/magnifying-glass.png"
              alt="Icona lente di ingrandimento"
              className={classes["icon-image"]}
            />
          </button>

          <Link to="/profile">
            <button className={classes["icon-button"]}>
              <img
                src="/images/user.png"
                alt="Icona profilo"
                className={classes["icon-image"]}
              />
            </button>
          </Link>

          <Link to="/cart">
            <button className={classes["icon-button"]}>
              <img
                src="/images/grocery-store.png"
                alt="Icona carrello"
                className={classes["icon-image"]}
              />
            </button>
          </Link>
        </div>
      </header>

      <div className="page-content">
        <Outlet />
      </div>
    </>
  );
}

export default RootLayout;

//per la gestione dei problemi delle richieste http
//metti uno spinner appena fai la richiesta, e gestisci i problemi ed eccezioni globalmente
