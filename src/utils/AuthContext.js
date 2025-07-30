import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from './api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionIdentifier, setSessionIdentifier] = useState(null);

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('t1_auth_token');
      const userData = localStorage.getItem('t1_user_data');
      
      if (token && userData) {
        try {
          const result = await authAPI.verifySession();
          if (result.valid) {
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
          } else {
            // Token inválido, limpiar
            localStorage.removeItem('t1_auth_token');
            localStorage.removeItem('t1_user_data');
          }
        } catch (error) {
          console.error('Error verificando sesión:', error);
          // En error, mantener sesión local
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      }
      
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('t1_auth_token', token);
    localStorage.setItem('t1_user_data', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
    
    localStorage.removeItem('t1_auth_token');
    localStorage.removeItem('t1_user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('t1_user_data', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    sessionIdentifier,
    setSessionIdentifier,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
