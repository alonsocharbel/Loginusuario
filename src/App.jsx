import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import VerifyPage from './pages/VerifyPage';
import AccountPage from './pages/AccountPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ReturnPage from './pages/ReturnPage';
import { AuthProvider } from './utils/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/cuenta/login" element={<LoginPage />} />
            <Route path="/cuenta/login/verificar" element={<VerifyPage />} />
            
            {/* Rutas protegidas */}
            <Route path="/cuenta" element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            } />
            <Route path="/cuenta/perfil" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/cuenta/configuracion" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/cuenta/pedidos/:id" element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/cuenta/pedidos/:id/devolucion" element={
              <ProtectedRoute>
                <ReturnPage />
              </ProtectedRoute>
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
