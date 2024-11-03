import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); //forse serve, così mi memorizzo i dati dell'utente
  
   
    const login = (userData) => {
      setIsAuthenticated(true);
      setUser(userData); 
    };
  
    
    const logout = () => {
      setIsAuthenticated(false);
      setUser(null); 
    };
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };