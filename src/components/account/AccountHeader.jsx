import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import './AccountHeader.css';

const AccountHeader = ({ currentPage }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/cuenta/login');
  };

  const getInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="account-header">
      <div className="account-header-container">
        <div className="account-header-left">
          <a href="/" className="account-logo">Mi tienda</a>
          <nav className="account-nav">
            <a href="/" className="nav-link">Tienda</a>
            <Link 
              to="/cuenta" 
              className={`nav-link ${currentPage === 'pedidos' ? 'nav-link-active' : ''}`}
            >
              Pedidos
            </Link>
          </nav>
        </div>
        
        <div className="account-header-right">
          <div className="user-menu">
            <button 
              className="user-menu-trigger"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-expanded={showDropdown}
              aria-label="Menú de usuario"
            >
              <span className="user-initials">{getInitials()}</span>
              <svg 
                className={`dropdown-arrow ${showDropdown ? 'rotate' : ''}`}
                width="12" 
                height="8" 
                viewBox="0 0 12 8"
              >
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </button>
            
            {showDropdown && (
              <>
                <div 
                  className="dropdown-overlay" 
                  onClick={() => setShowDropdown(false)}
                />
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <p className="user-name">{user?.name || 'Usuario'}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider" />
                  <Link 
                    to="/cuenta/perfil" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Perfil
                  </Link>
                  <Link 
                    to="/cuenta/configuracion" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Configuración
                  </Link>
                  <div className="dropdown-divider" />
                  <button 
                    className="dropdown-item dropdown-logout"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AccountHeader;