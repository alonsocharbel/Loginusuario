import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from './api';
import { SESSION_CONFIG } from './constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionIdentifier, setSessionIdentifier] = useState(null);

  // Guardar sesión
  const saveSession = (token, userData) => {
    localStorage.setItem(SESSION_CONFIG.TOKEN_KEY, token);
    localStorage.setItem(SESSION_CONFIG.USER_KEY, JSON.stringify(userData));
    document.cookie = `t1_session=${token}; path=/; max-age=${SESSION_CONFIG.EXPIRY_HOURS * 3600}`;
    setUser(userData);
  };

  // Limpiar sesión
  const clearSession = () => {
    localStorage.removeItem(SESSION_CONFIG.TOKEN_KEY);
    localStorage.removeItem(SESSION_CONFIG.USER_KEY);
    document.cookie = 't1_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setUser(null);
    setSessionIdentifier(null);
  };

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem(SESSION_CONFIG.TOKEN_KEY);
      const savedUser = localStorage.getItem(SESSION_CONFIG.USER_KEY);
      
      if (token && savedUser) {
        try {
          const response = await authAPI.verifySession();
          if (response.valid) {
            setUser(JSON.parse(savedUser));
          } else {
            clearSession();
          }
        } catch (error) {
          clearSession();
        }
      }
      
      setLoading(false);
    };

    checkSession();
  }, []);

  // Escuchar cambios en otras pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === SESSION_CONFIG.TOKEN_KEY) {
        if (e.newValue === null) {
          setUser(null);
        } else {
          const savedUser = localStorage.getItem(SESSION_CONFIG.USER_KEY);
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Login
  const login = async (emailOrPhone, code) => {
    try {
      const response = await authAPI.verifyCode(emailOrPhone, code);
      saveSession(response.token, response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignorar errores de logout
    } finally {
      clearSession();
    }
  };

  // Cerrar todas las sesiones
  const closeAllSessions = async () => {
    try {
      await authAPI.closeAllSessions();
      clearSession();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    sessionIdentifier,
    setSessionIdentifier,
    login,
    logout,
    closeAllSessions,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
