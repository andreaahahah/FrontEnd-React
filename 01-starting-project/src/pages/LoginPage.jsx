import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../GlobalContext/AuthContext";


function LoginPage() {
  const { isAuthenticated, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Effettua il reindirizzamento se l'utente è già autenticato
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  // Quando l'utente non è autenticato, lo indirizziamo a Keycloak per il login
  const handleLogin = () => {
    login(); // Questo invia l'utente a Keycloak per il login
  };

  return (
    <>
      {!isAuthenticated && (
        <div>
          <h2>Per favore, accedi al tuo account</h2>
          <button onClick={handleLogin}>Login con Keycloak</button>
        </div>
      )}
    </>
  );
}

export default LoginPage;
