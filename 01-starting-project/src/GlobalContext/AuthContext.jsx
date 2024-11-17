import { createContext, useState, useEffect } from "react";
import Keycloak from "keycloak-js";
import axios from "axios";
import { baseurl } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [keycloak, setKeycloak] = useState(null);

  useEffect(() => {
    const keycloakInstance = new Keycloak({
      url: "http://localhost:8080/",
      realm: "piattaforme",
      clientId: "my-frontend",
    });

    keycloakInstance
      .init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: window.location.origin,
      })
      .then((authenticated) => {
        
        if (authenticated ) {
          setIsAuthenticated(true);
          setUser(keycloakInstance.tokenParsed);

          const roles = keycloakInstance.tokenParsed?.realm_access?.roles || [];
          setUserRoles(roles);

          const token = keycloakInstance.token;
          const name = keycloakInstance.tokenParsed.given_name;
          const surname = keycloakInstance.tokenParsed.family_name;
          const mail = keycloakInstance.tokenParsed.email;
          if(token){
          axios
            .post(
              `${baseurl}/utente/addUtente?nome=${name}&cognome=${surname}&email=${mail}`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ).catch(error =>{

            });}
        }
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
    <AuthContext.Provider
      value={{ isAuthenticated, user, userRoles, login, logout, keycloak }}
    >
      {children}
    </AuthContext.Provider>
  );
};
