import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import './DemoNavigator.css';

const DemoNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleScenarioChange = async (scenario) => {
    setIsOpen(false);
    
    switch (scenario) {
      case 'login-otp':
        // Limpiar cualquier estado anterior
        logout();
        localStorage.clear();
        delete window.__T1_MOCK_ORDERS_OVERRIDE__;
        navigate('/cuenta/login');
        break;
      
      case 'login-t1pay':
        // Limpiar y mostrar login
        logout();
        localStorage.clear();
        delete window.__T1_MOCK_ORDERS_OVERRIDE__;
        navigate('/cuenta/login');
        // Mostrar instrucciones para hacer clic en T1 Pay
        setTimeout(() => {
          alert('Haz clic en el botón rojo "Iniciar sesión con t1 pay" para simular el flujo');
        }, 500);
        break;
      
      case 'cliente-sin-pedidos':
        // Simular login directo sin pasar por el flujo de OTP
        const userSinPedidos = {
          name: 'Usuario Demo',
          email: 'demo@sinpedidos.com',
          phone: '+52 55 1234 5678'
        };
        
        // Establecer el override de pedidos vacío ANTES de login
        window.__T1_MOCK_ORDERS_OVERRIDE__ = [];
        
        // Hacer login directo con token simulado
        const tokenSinPedidos = 'mock-token-sin-pedidos-' + Date.now();
        await login(tokenSinPedidos, userSinPedidos);
        
        // Forzar recarga completa para que se aplique el override
        window.location.href = '/cuenta';
        break;
      
      case 'cliente-con-pedidos':
        // Simular login directo con pedidos
        const userConPedidos = {
          name: 'Alonso Charbel',
          email: 'alonsocharbel@gmail.com',
          phone: '+52 55 4800 1187'
        };
        
        // Eliminar el override para usar los pedidos por defecto
        delete window.__T1_MOCK_ORDERS_OVERRIDE__;
        
        // Hacer login directo con token simulado
        const tokenConPedidos = 'mock-token-con-pedidos-' + Date.now();
        await login(tokenConPedidos, userConPedidos);
        
        // Forzar recarga completa para que se aplique el cambio
        window.location.href = '/cuenta';
        break;
      
      case 'reset':
        logout();
        localStorage.clear();
        delete window.__T1_MOCK_ORDERS_OVERRIDE__;
        navigate('/cuenta/login');
        break;
      
      default:
        break;
    }
  };

  // No mostrar en ciertas rutas
  if (location.pathname === '/cuenta/login/t1pay' || 
      location.pathname === '/cuenta/login/t1pay-callback') {
    return null;
  }

  return (
    <div className="demo-navigator">
      <button 
        className="demo-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Navegador de demos"
      >
        🧪
      </button>
      
      {isOpen && (
        <div className="demo-menu">
          <h3>Seleccionar Demo</h3>
          <button onClick={() => handleScenarioChange('login-otp')}>
            📧 Login con OTP
          </button>
          <button onClick={() => handleScenarioChange('login-t1pay')}>
            💳 Login con T1 Pay
          </button>
          <hr />
          <button onClick={() => handleScenarioChange('cliente-sin-pedidos')}>
            📭 Cliente sin pedidos
          </button>
          <button onClick={() => handleScenarioChange('cliente-con-pedidos')}>
            📦 Cliente con pedidos
          </button>
          <hr />
          <button onClick={() => handleScenarioChange('reset')}>
            🔄 Resetear
          </button>
        </div>
      )}
    </div>
  );
};

export default DemoNavigator;