import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './T1PayCallbackPage.css';

const T1PayLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Ingresa tu correo electrónico');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Solo un dígito
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus siguiente input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    // Si completó todos los dígitos, verificar
    if (index === 5 && value) {
      const fullOtp = newOtp.join('');
      if (fullOtp === '123456') {
        // Simular login exitoso
        setTimeout(() => {
          navigate('/cuenta/login/t1pay-callback');
        }, 500);
      } else {
        setError('Código incorrecto. Usa 123456');
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  if (step === 'otp') {
    return (
      <div className="t1pay-container">
        <div className="t1pay-card">
          <div className="t1pay-header">
            <h1 className="t1pay-logo">t1 pay</h1>
            <span className="merchant-name">Mi tienda</span>
          </div>
          
          <div className="t1pay-login-form">
            <h2 className="t1pay-title">Confirma tu correo electrónico</h2>
            <p className="t1pay-subtitle">{email}</p>
            
            <p style={{ marginBottom: '24px', color: '#666' }}>
              Ingresa el código enviado a <strong>tu correo electrónico</strong>.
            </p>
            
            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  className={`otp-box ${digit ? 'filled' : ''}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength="1"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            
            {error && (
              <p style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '16px' }}>
                {error}
              </p>
            )}
            
            <a 
              href="#" 
              className="change-email-link"
              onClick={(e) => {
                e.preventDefault();
                setStep('email');
                setOtp(['', '', '', '', '', '']);
                setError('');
              }}
            >
              Cambia la dirección de correo electrónico
            </a>
            
            {process.env.NODE_ENV === 'development' && (
              <div style={{ 
                marginTop: '24px', 
                padding: '12px', 
                backgroundColor: '#FFF7AD', 
                borderRadius: '8px',
                fontSize: '14px',
                color: '#856404'
              }}>
                🔧 Modo desarrollo: Usa el código <strong>123456</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="t1pay-container">
      <div className="t1pay-card">
        <div className="t1pay-header">
          <h1 className="t1pay-logo">t1 pay</h1>
          <span className="merchant-name">Mi tienda</span>
        </div>
        
        <div className="t1pay-login-form">
          <h2 className="t1pay-title">Inicia sesión en T1 Pay</h2>
          <p className="t1pay-subtitle">O crea una cuenta</p>
          
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              className="t1pay-input"
              placeholder="Introduce tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            
            {error && (
              <p style={{ color: 'var(--error)', marginBottom: '16px' }}>
                {error}
              </p>
            )}
            
            <button 
              type="submit"
              className="btn-t1pay-continue"
            >
              Continuar
            </button>
          </form>
          
          <button 
            className="btn-link-t1pay"
            onClick={() => navigate('/cuenta/login')}
          >
            <span className="icon">🔑</span> Iniciar sesión con una clave de acceso
          </button>
          
          <p className="t1pay-terms">
            Al continuar, aceptas los <a href="#">términos</a>, <a href="#">política de privacidad</a> de T1 Pay 
            y compartir tu nombre, correo electrónico y avatar con Mi tienda. 
            Consulta los <a href="#">términos</a> y la <a href="#">política de privacidad</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default T1PayLoginPage;
