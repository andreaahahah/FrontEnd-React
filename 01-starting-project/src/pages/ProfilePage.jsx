import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../GlobalContext/AuthContext";
import classes from "../cssPages/Profile.module.css";

function ProfilePage() {
  const { isAuthenticated, user, login, logout, keycloak } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
   
  };

  const handleRegister = () => {
    console.log(keycloak);
    if (keycloak) {
      keycloak.register();  // Avvia il flusso di registrazione di Keycloak
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Utente disconnesso");
    }
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated ? (
        <div>
          <button className={classes["logout-btn"]} onClick={handleLogOut}>
            LOGOUT
          </button>
          <h2>BENTORNATO {user?.name}</h2>
          <h3>{user?.email}</h3>
          <h3>{user?.surname}</h3>
          <div className={classes["buttons-container"]}>
            <Link to="/iTuoiOrdini">
              <button className={classes["login-btn"]}>I TUOI ORDINI</button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <h2>BENVENUTO,</h2>
          <h3>sembra che al momento tu non sia autenticato</h3>
          <div className={classes["buttons-container"]}>
            <button className={classes["login-btn"]} onClick={login}>
              LOGIN
            </button>
            <button className={classes["register-btn"]} onClick={handleRegister}>
              REGISTRATI
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfilePage;
