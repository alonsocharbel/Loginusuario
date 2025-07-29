import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { canReturnOrder } from '../../utils/validation';
import './OrderActions.css';

const OrderActions = ({ 
  orderId, 
  orderNumber,
  status, 
  deliveryDate,
  onBuyAgain, 
  onDownloadInvoice 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const canReturn = () => {
    return canReturnOrder({ status, deliveryDate });
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="order-actions" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="actions-trigger"
        aria-label="Más acciones"
        aria-expanded={isOpen}
      >
        ⋯
      </button>
      
      {isOpen && (
        <div className="actions-menu">
          <Link 
            to={`/cuenta/pedidos/${orderId}`} 
            className="action-item"
            onClick={() => setIsOpen(false)}
          >
            Ver detalles
          </Link>
          
          <button 
            onClick={() => {
              onBuyAgain(orderId);
              setIsOpen(false);
            }} 
            className="action-item"
          >
            Volver a comprar
          </button>
          
          <button 
            onClick={() => {
              onDownloadInvoice(orderId);
              setIsOpen(false);
            }} 
            className="action-item"
          >
            Descargar factura
          </button>
          
          {canReturn() && (
            <Link 
              to={`/cuenta/pedidos/${orderId}/devolucion`} 
              className="action-item"
              onClick={() => setIsOpen(false)}
            >
              Solicitar devolución
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderActions;