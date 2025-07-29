import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { validateOTPCode, maskEmail, maskPhone, detectInputType } from '../utils/validation';
import { authAPI, trackEvent } from '../utils/api';
import { OTP_CONFIG, ERROR_TYPES } from '../utils/constants';
import Button from '../components/shared/Button';
import Toast from '../components/shared/Toast';
import './VerifyPage.css';

const VerifyPage = () => {
  const navigate = useNavigate();
  const { sessionIdentifier, login } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [blockTime, setBlockTime] = useState(0);
  const [toast, setToast] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!sessionIdentifier) {
      navigate('/cuenta/login');
    }
  }, [sessionIdentifier, navigate]);

  // Cooldown timer para reenvío
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Block timer
  useEffect(() => {
    if (blockTime > 0) {
      const timer = setTimeout(() => {
        setBlockTime(blockTime - 1);
      }, 60000); // Actualizar cada minuto
      return () => clearTimeout(timer);
    } else if (blockTime === 0 && isBlocked) {
      setIsBlocked(false);
      setAttempts(0);
    }
  }, [blockTime, isBlocked]);

  const handleCodeChange = (index, value) => {
    // Solo aceptar números
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-avanzar al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit cuando se completan los 6 dígitos
    if (newCode.every(digit => digit !== '')) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Manejar backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (codeString = code.join('')) => {
    if (!validateOTPCode(codeString)) {
      setError('Código incompleto');
      return;
    }

    if (isBlocked) {
      setError(ERROR_TYPES.MAX_ATTEMPTS);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(sessionIdentifier, codeString);
      
      if (result.success) {
        trackEvent('codigo_verificado', { attempts: attempts + 1 });
        trackEvent('login_completado', { method: detectInputType(sessionIdentifier) });
        navigate('/cuenta');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= OTP_CONFIG.MAX_ATTEMPTS) {
          setIsBlocked(true);
          setBlockTime(OTP_CONFIG.BLOCK_DURATION_MINUTES);
          setError(ERROR_TYPES.MAX_ATTEMPTS);
          trackEvent('login_bloqueado', { identifier: sessionIdentifier });
        } else {
          setError(`${ERROR_TYPES.INVALID_CODE} (Intento ${newAttempts} de ${OTP_CONFIG.MAX_ATTEMPTS})`);
        }
        
        // Limpiar código
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      if (error.message.includes('expired')) {
        setError(ERROR_TYPES.CODE_EXPIRED);
      } else {
        setError(ERROR_TYPES.NETWORK_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    try {
      await authAPI.resendCode(sessionIdentifier);
      setResendCooldown(OTP_CONFIG.RESEND_COOLDOWN_SECONDS);
      setToast({ message: 'Código reenviado', type: 'success' });
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setToast({ message: ERROR_TYPES.NETWORK_ERROR, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const maskedIdentifier = sessionIdentifier 
    ? (detectInputType(sessionIdentifier) === 'email' 
        ? maskEmail(sessionIdentifier) 
        : maskPhone(sessionIdentifier))
    : '';

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Verificación</h1>
        <p className="auth-subtitle">
          Te enviamos un código de 6 dígitos a:<br />
          <strong>{maskedIdentifier}</strong>
        </p>
        
        <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="verify-form">
          <div className="otp-input-container">
            {[0, 1, 2, 3, 4, 5].map(index => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={code[index]}
                onChange={e => handleCodeChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`otp-input ${error ? 'otp-input-error' : ''}`}
                aria-label={`Dígito ${index + 1}`}
                disabled={loading || isBlocked}
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={code.join('').length !== 6 || loading || isBlocked}
            loading={loading}
          >
            Verificar
          </Button>
        </form>
        
        <div className="auth-actions">
          {!isBlocked && (
            <button
              onClick={handleResend}
              className="link-button"
              disabled={resendCooldown > 0 || loading}
            >
              {resendCooldown > 0
                ? `Reenviar código en ${resendCooldown}s`
                : '¿No recibiste el código? Reenviar código'
              }
            </button>
          )}
          
          <a href="/cuenta/login" className="link-button">
            Usar otro email
          </a>
        </div>
        
        {isBlocked && (
          <div className="blocked-message">
            <p>Has alcanzado el número máximo de intentos.</p>
            <p>Intenta nuevamente en {blockTime} minutos.</p>
          </div>
        )}
        
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

export default VerifyPage;