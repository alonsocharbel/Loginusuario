import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AccountHeader from '../components/account/AccountHeader';
import Button from '../components/shared/Button';
import Toast from '../components/shared/Toast';
import './ReturnPage.css';

const ReturnPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Mock order data - en producción vendría de la API
  const order = {
    id: id,
    number: id,
    items: [
      {
        id: '1',
        name: 'GRAV ORBIS LUME WATERPIPE (Copia)',
        price: 2999.00,
        quantity: 1,
        image: 'https://picsum.photos/150/150?random=1'
      }
    ]
  };

  const reasons = [
    'Producto defectuoso',
    'No es lo que esperaba',
    'Pedido incorrecto',
    'Ya no lo necesito',
    'Otro'
  ];

  const handleItemToggle = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const calculateReturnTotal = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = order.items.find(i => i.id === itemId);
      return total + (item ? item.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      setToast({ message: 'Selecciona al menos un producto', type: 'error' });
      return;
    }

    if (!reason) {
      setToast({ message: 'Selecciona un motivo de devolución', type: 'error' });
      return;
    }

    setLoading(true);
    
    // Simular envío
    setTimeout(() => {
      setToast({ message: 'Solicitud de devolución enviada exitosamente', type: 'success' });
      setTimeout(() => {
        navigate(`/cuenta/pedidos/${id}`);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="account-container">
      <AccountHeader />
      
      <div className="return-page">
        <div className="return-header">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Solicitar devolución - Pedido #{order.number}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="return-form">
          <section className="return-section">
            <h2>Selecciona los productos a devolver:</h2>
            
            <div className="return-items">
              {order.items.map(item => (
                <label key={item.id} className="return-item">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleItemToggle(item.id)}
                  />
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Cantidad: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ${item.price.toFixed(2)}
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="return-section">
            <h2>Motivo de la devolución*</h2>
            <select 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              className="reason-select"
              required
            >
              <option value="">Seleccionar motivo</option>
              {reasons.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </section>

          <section className="return-section">
            <h2>Comentarios adicionales (opcional)</h2>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Cuéntanos más sobre el motivo de tu devolución"
              rows={4}
              className="comments-textarea"
            />
          </section>

          <div className="return-summary">
            <p>Total a devolver: <strong>${calculateReturnTotal().toFixed(2)}</strong></p>
          </div>

          <div className="return-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading || selectedItems.length === 0}
            >
              Continuar
            </Button>
          </div>
        </form>
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
