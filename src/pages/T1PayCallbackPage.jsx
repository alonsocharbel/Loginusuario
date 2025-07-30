import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../utils/api';
import './T1PayCallbackPage.css';

const T1PayCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simular el flujo de T1 Pay
    const simulateT1PayFlow = async () => {
      // En desarrollo, simular usuario autenticado
      if (process.env.NODE_ENV === 'development') {
        const mockUser = {
          name: 'Alonso Charbel Moncada',
          email: 'alonsocharbel@gmail.com',
          avatar: null
        };
        
        setUser(mockUser);
        setLoading(false);
        
        // Auto-continuar después de 1 segundo
        setTimeout(() => {
          handleContinue();
        }, 1000);
      }
    };

    simulateT1PayFlow();
  }, []);

  const handleContinue = () => {
    // Simular login exitoso
    const mockToken = 't1pay-token-' + Date.now();
    const mockUser = {
      name: 'Alonso Charbel Moncada',
      email: 'alonsocharbel@gmail.com',
      phone: '+52 55 4800 1187'
    };
    
    localStorage.setItem('t1_auth_token', mockToken);
    localStorage.setItem('t1_user_data', JSON.stringify(mockUser));
    
    navigate('/cuenta');
  };

  const handleUseOtherAccount = () => {
    navigate('/cuenta/login');
  };

  if (loading) {
    return (
      <div className="t1pay-container">
        <div className="t1pay-card">
          <div className="t1pay-header">
            <h1 className="t1pay-logo">t1 pay</h1>
            <span className="merchant-name">Mi tienda</span>
          </div>
          <div className="loader-container">
            <div className="loader"></div>
            <p>Conectando con t1 pay...</p>
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
        
        <div className="t1pay-content">
          <div className="user-avatar">
            <span className="avatar-initials">AC</span>
          </div>
          
          <h2 className="user-name">{user.name}</h2>
          <p className="user-email">{user.email}</p>
          
          <button 
            className="btn-t1pay-continue"
            onClick={handleContinue}
          >
            Continuar
          </button>
          
          <button 
            className="btn-link-t1pay"
            onClick={handleUseOtherAccount}
          >
            <span className="icon">↩</span> Usar otra cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default T1PayCallbackPage;
