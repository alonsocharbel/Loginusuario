import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import VerifyPage from './pages/VerifyPage';
import AccountPage from './pages/AccountPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ReturnPage from './pages/ReturnPage';
import T1PayLoginPage from './pages/T1PayLoginPage';
import T1PayCallbackPage from './pages/T1PayCallbackPage';
import { AuthProvider } from './utils/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import DemoNavigator from './components/shared/DemoNavigator';
import './styles/App.css';

function App() {
  // En desarrollo, desactivar protección de rutas para testing
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          {/* Demo Navigator solo en desarrollo */}
          {isDevelopment && <DemoNavigator />}
          <Routes>
            {/* Rutas públicas */}
            <Route path="/cuenta/login" element={<LoginPage />} />
            <Route path="/cuenta/login/verificar" element={<VerifyPage />} />
            <Route path="/cuenta/login/t1pay" element={<T1PayLoginPage />} />
            <Route path="/cuenta/login/t1pay-callback" element={<T1PayCallbackPage />} />
            
            {/* Rutas protegidas - En desarrollo no requieren autenticación */}
            <Route path="/cuenta" element={
              isDevelopment ? <AccountPage /> : (
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              )
            } />
            <Route path="/cuenta/perfil" element={
              isDevelopment ? <ProfilePage /> : (
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              )
            } />
            <Route path="/cuenta/configuracion" element={
              isDevelopment ? <SettingsPage /> : (
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              )
            } />
            <Route path="/cuenta/pedidos/:id" element={
              isDevelopment ? <OrderDetailPage /> : (
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              )
            } />
            <Route path="/cuenta/pedidos/:id/devolucion" element={
              isDevelopment ? <ReturnPage /> : (
                <ProtectedRoute>
                  <ReturnPage />
                </ProtectedRoute>
              )
            } />
            
            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/cuenta" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
