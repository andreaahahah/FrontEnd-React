import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../GlobalContext/AuthContext";
import classes from "../cssPages/Profile.module.css";

function ProfilePage() {
  const { isAuthenticated, user, login, logout, keycloak } = useContext(AuthContext);

  const handleLogOut = () => {
    logout();
  };

  const handleRegister = () => {
    console.log(keycloak)
    // Se Keycloak è configurato e l'utente non è autenticato, redirigi alla registrazione
    if (keycloak) {
      keycloak.register(); // Inizia il flusso di registrazione di Keycloak
    }
  };

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
