import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // Assicurati che il percorso sia corretto

const useAuth = () => {
    const { isAuthenticated, user } = useContext(AuthContext);

    const getToken = () => {
        if (isAuthenticated) {
            // Puoi estrarre il token da Keycloak, se è presente
            console.log("token "+user?.keycloak?.token)
            return user?.keycloak?.token;
        }
        return null;
    };

    return { isAuthenticated, user, getToken };
};

export default useAuth;
