import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { validateEmailOrPhone } from '../utils/validation';
import { authAPI, trackEvent } from '../utils/api';
import { ERROR_TYPES } from '../utils/constants';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import Toast from '../components/shared/Toast';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setSessionIdentifier } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  
  // Check if T1pagos is active (from env or config)
  const hasT1Pagos = process.env.REACT_APP_T1_PAY_CLIENT_ID ? true : false;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/cuenta');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const value = e.target.value;
    setEmailOrPhone(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formato
    const validation = validateEmailOrPhone(emailOrPhone);
    if (!validation.isValid) {
      setError(ERROR_TYPES.INVALID_FORMAT);
      return;
    }

    setLoading(true);
    setError('');
    trackEvent('login_iniciado', { method: validation.type });

    try {
      const response = await authAPI.sendCode(emailOrPhone);
      
      if (response.success) {
        trackEvent('codigo_enviado', { success: true });
        setSessionIdentifier(emailOrPhone);
        navigate('/cuenta/login/verificar');
      } else if (response.blocked) {
        setError(ERROR_TYPES.EMAIL_BOUNCED);
        trackEvent('email_bounced', { email: emailOrPhone });
      }
    } catch (error) {
      setError(ERROR_TYPES.NETWORK_ERROR);
      trackEvent('codigo_enviado', { success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleT1PayLogin = () => {
    trackEvent('login_con_t1pay', { initiated: true });
    const authUrl = `${process.env.REACT_APP_T1_PAY_URL}/auth?client_id=${process.env.REACT_APP_T1_PAY_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/cuenta/login/t1pay-callback')}`;
    window.location.href = authUrl;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Iniciar sesión</h1>
        <p className="auth-subtitle">Selecciona cómo quieres iniciar sesión</p>
        
        {hasT1Pagos && (
          <>
            <Button
              variant="t1pay"
              fullWidth
              onClick={handleT1PayLogin}
              className="t1pay-button"
            >
              Iniciar sesión con T1 Pay
            </Button>
            
            <div className="divider">
              <span>o</span>
            </div>
          </>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="text"
            placeholder="Email o teléfono móvil"
            value={emailOrPhone}
            onChange={handleChange}
            error={error}
            required
            autoComplete="email tel"
            autoFocus
            inputClassName="auth-input"
          />
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={!emailOrPhone || loading}
            loading={loading}
          >
            Continuar
          </Button>
        </form>
        
        <p className="auth-note">
          ¿Primera vez? Al continuar crearemos tu cuenta
        </p>
        
        <a href="/privacidad" className="privacy-link">Privacidad</a>
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

export default LoginPage;