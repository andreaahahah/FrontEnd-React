import { createContext, useState, useEffect } from "react";
import Keycloak from "keycloak-js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]); // Stato per i ruoli dell'utente
  const [keycloak, setKeycloak] = useState(null);

  useEffect(() => {
    const keycloakInstance = new Keycloak({
      url: "http://localhost:8080/",
      realm: "piattaforme",
      clientId: "my-frontend"
    });

    keycloakInstance.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    }).then(authenticated => {
      if (authenticated) {
        setIsAuthenticated(true);
        setUser(keycloakInstance.tokenParsed);
        
        // Ottieni i ruoli dal token JWT
        const roles = keycloakInstance.tokenParsed?.realm_access?.roles || [];
        setUserRoles(roles); // Salva i ruoli dell'utente nello stato
      } else {
        console.log("User not authenticated");
      }
    }).catch(error => {
      console.log("Error during Keycloak initialization", error);
    });

    setKeycloak(keycloakInstance);
  }, []);

  const login = () => {
    keycloak?.login();
  };

  const logout = () => {
    keycloak?.logout();
    setIsAuthenticated(false);
    setUser(null);
    setUserRoles([]);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userRoles, login, logout, keycloak }}>
      {children}
    </AuthContext.Provider>
  );
};
