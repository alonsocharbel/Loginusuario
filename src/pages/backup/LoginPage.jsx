import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { authAPI, trackEvent } from '../utils/api';
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
    // Limpiar error cuando el usuario escribe
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica - simplificada para evitar problemas
    if (!emailOrPhone || emailOrPhone.trim() === '') {
      setError('Por favor ingresa tu email o teléfono');
      return;
    }

    // Validación muy simple de formato
    const hasAtSymbol = emailOrPhone.includes('@');
    const hasDot = emailOrPhone.includes('.');
    const isLikelyEmail = hasAtSymbol && hasDot;
    const isLikelyPhone = /\d/.test(emailOrPhone) && emailOrPhone.length >= 10;

    if (!isLikelyEmail && !isLikelyPhone) {
      setError('Por favor ingresa un email o teléfono válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Intentando enviar código para:', emailOrPhone);
      
      // En modo desarrollo, simular éxito directamente
      if (process.env.NODE_ENV === 'development') {
        console.log('Modo desarrollo - simulando envío exitoso');
        trackEvent('codigo_enviado', { success: true, dev: true });
        setSessionIdentifier(emailOrPhone);
        
        // Pequeña demora para simular red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Navegar a la página de verificación
        navigate('/cuenta/login/verificar');
        return;
      }

      // En producción, usar la API real
      const response = await authAPI.sendCode(emailOrPhone);
      
      if (response && response.success) {
        trackEvent('codigo_enviado', { success: true });
        setSessionIdentifier(emailOrPhone);
        navigate('/cuenta/login/verificar');
      } else {
        setError('Error al enviar el código. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al enviar código:', error);
      setError('Error de conexión. Intenta nuevamente');
    } finally {
      setLoading(false);
    }
  };

  const handleT1PayLogin = () => {
    trackEvent('login_con_t1pay', { initiated: true });
    // En desarrollo, simular el flujo de T1 Pay
    if (process.env.NODE_ENV === 'development') {
      navigate('/cuenta/login/t1pay');
    } else {
      const authUrl = `${process.env.REACT_APP_T1_PAY_URL}/auth?client_id=${process.env.REACT_APP_T1_PAY_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/cuenta/login/t1pay-callback')}`;
      window.location.href = authUrl;
    }
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
              Iniciar sesión con t1 pay
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
        
        {process.env.NODE_ENV === 'development' && (
          <div className="dev-info">
            <p>🔧 Modo desarrollo: Usa el código <strong>123456</strong> para verificar</p>
          </div>
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

export default LoginPage;
