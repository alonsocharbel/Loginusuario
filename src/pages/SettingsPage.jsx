import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import AccountHeader from '../components/account/AccountHeader';
import Button from '../components/shared/Button';
import Toast from '../components/shared/Toast';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { closeAllSessions } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const handleCloseAllSessions = async () => {
    setLoading(true);
    try {
      const result = await closeAllSessions();
      if (result.success) {
        setToast({ message: 'Todas las sesiones cerradas', type: 'success' });
        setTimeout(() => {
          navigate('/cuenta/login');
        }, 2000);
      } else {
        setToast({ message: 'Error al cerrar sesiones', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Error al cerrar sesiones', type: 'error' });
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="account-container">
      <AccountHeader currentPage="configuracion" />
      
      <div className="account-content">
        <h1>Configuración</h1>
        
        <div className="settings-section">
          <div className="settings-icon">🔒</div>
          
          <h2>Cerrar todas las sesiones</h2>
          
          <p className="settings-description">
            Si perdiste un dispositivo o tienes inquietudes relacionadas con la seguridad, 
            cierra todas las sesiones para garantizar la seguridad de tu cuenta.
          </p>
          
          <Button
            variant="primary"
            onClick={() => setShowConfirm(true)}
            loading={loading}
          >
            Cerrar todas las sesiones
          </Button>
          
          <p className="settings-note">
            Se cerrará también la sesión en este dispositivo.
          </p>
        </div>
        
        {showConfirm && (
          <>
            <div className="modal-overlay" onClick={() => setShowConfirm(false)} />
            <div className="confirm-modal">
              <h3>¿Cerrar todas las sesiones?</h3>
              <p>
                Esto cerrará tu sesión en todos los dispositivos, incluyendo este.
                Tendrás que iniciar sesión nuevamente.
              </p>
              <div className="modal-actions">
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCloseAllSessions}
                  loading={loading}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default SettingsPage;