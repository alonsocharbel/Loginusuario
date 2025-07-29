import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { accountAPI, trackEvent } from '../utils/api';
import { formatPrice } from '../utils/validation';
import AccountHeader from '../components/account/AccountHeader';
import Button from '../components/shared/Button';
import Loader from '../components/shared/Loader';
import Toast from '../components/shared/Toast';
import './ReturnPage.css';

const RETURN_REASONS = [
  { value: 'defective', label: 'Producto defectuoso' },
  { value: 'not_as_expected', label: 'No es lo que esperaba' },
  { value: 'wrong_item', label: 'Pedido incorrecto' },
  { value: 'no_longer_needed', label: 'Ya no lo necesito' },
  { value: 'other', label: 'Otro' }
];

const ReturnPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await accountAPI.getOrderDetail(id);
      setOrder(response.order);
    } catch (error) {
      setToast({ message: 'Error al cargar pedido', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleItemToggle = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const calculateReturnTotal = () => {
    if (!order || selectedItems.length === 0) return 0;
    
    return order.items
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      setToast({ message: 'Selecciona al menos un producto', type: 'error' });
      return;
    }

    if (!reason) {
      setToast({ message: 'Selecciona un motivo de devolución', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      await accountAPI.startReturn(id, {
        items: selectedItems,
        reason,
        comments
      });
      
      trackEvent('devolucion_iniciada', { 
        orderId: id, 
        reason,
        itemCount: selectedItems.length 
      });
      
      setToast({ message: 'Solicitud de devolución enviada', type: 'success' });
      
      setTimeout(() => {
        navigate(`/cuenta/pedidos/${id}`);
      }, 2000);
    } catch (error) {
      setToast({ message: 'Error al procesar solicitud', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="account-container">
        <AccountHeader />
        <div className="loader-page">
          <Loader size="large" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="account-container">
        <AccountHeader />
        <div className="account-content">
          <p>Pedido no encontrado</p>
          <Link to="/cuenta">Volver a pedidos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <AccountHeader />
      
      <div className="account-content">
        <Link to={`/cuenta/pedidos/${id}`} className="back-link">
          ← Solicitar devolución - Pedido #{order.number}
        </Link>
        
        <div className="return-container">
          <div className="return-form">
            <h2>Selecciona los productos a devolver:</h2>
            
            <div className="return-items">
              {order.items.map(item => (
                <label key={item.id} className="return-item">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleItemToggle(item.id)}
                  />
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="return-item-image"
                  />
                  <div className="return-item-details">
                    <h4>{item.name}</h4>
                    {item.variant && <p className="item-variant">{item.variant}</p>}
                    <p className="item-quantity">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="return-item-price">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </label>
              ))}
            </div>
            
            <div className="return-reason">
              <label htmlFor="reason">
                Motivo de la devolución<span className="required">*</span>
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="form-select"
              >
                <option value="">Seleccionar motivo</option>
                {RETURN_REASONS.map(r => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="return-comments">
              <label htmlFor="comments">
                Comentarios adicionales (opcional)
              </label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="form-textarea"
                rows="4"
                placeholder="Cuéntanos más sobre el motivo de tu devolución..."
              />
            </div>
            
            <div className="return-total">
              <span>Total a devolver:</span>
              <span className="total-amount">{formatPrice(calculateReturnTotal())}</span>
            </div>
            
            <div className="return-actions">
              <Button
                variant="secondary"
                onClick={() => navigate(`/cuenta/pedidos/${id}`)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={submitting}
                disabled={selectedItems.length === 0 || !reason}
              >
                Continuar
              </Button>
            </div>
          </div>
          
          <div className="return-info">
            <h3>Información importante</h3>
            <ul>
              <li>Los productos deben estar en su empaque original</li>
              <li>Tienes 30 días desde la entrega para solicitar una devolución</li>
              <li>Una vez aprobada, recibirás una guía de envío por email</li>
              <li>El reembolso se procesará una vez recibamos los productos</li>
              <li>El tiempo de reembolso depende de tu método de pago original</li>
            </ul>
            
            <div className="help-section">
              <h4>¿Necesitas ayuda?</h4>
              <p>Contáctanos en:</p>
              <p><strong>soporte@tienda.com</strong></p>
              <p><strong>WhatsApp: +52 55 1234 5678</strong></p>
            </div>
          </div>
        </div>
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

export default ReturnPage;