import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { accountAPI, trackEvent } from '../utils/api';
import { formatDate, formatPrice, canReturnOrder } from '../utils/validation';
import { ORDER_STATUS_TEXT } from '../utils/constants';
import AccountHeader from '../components/account/AccountHeader';
import Button from '../components/shared/Button';
import Loader from '../components/shared/Loader';
import Toast from '../components/shared/Toast';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await accountAPI.getOrderDetail(id);
      setOrder(response.order);
      trackEvent('pedido_visto', { orderId: id });
    } catch (error) {
      setToast({ message: 'Error al cargar pedido', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyAgain = async () => {
    try {
      trackEvent('volver_a_comprar', { orderId: id });
      const response = await accountAPI.buyAgain(id);
      
      if (response.success) {
        setToast({ 
          message: `${response.itemsAdded} productos agregados al carrito`, 
          type: 'success' 
        });
        
        setTimeout(() => {
          window.location.href = '/carrito';
        }, 2000);
      }
    } catch (error) {
      setToast({ message: 'Error al agregar productos', type: 'error' });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'delivered':
        return '✓';
      case 'cancelled':
      case 'refunded':
        return '✕';
      case 'return_in_progress':
        return '⚠️';
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
      case 'delivered':
        return 'status-success';
      case 'cancelled':
      case 'refunded':
        return 'status-error';
      case 'return_in_progress':
        return 'status-warning';
      default:
        return '';
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
        <div className="order-detail-header">
          <Link to="/cuenta" className="back-link">
            ← Pedido #{order.number}
          </Link>
          <Button
            variant="secondary"
            onClick={handleBuyAgain}
          >
            Volver a comprar
          </Button>
        </div>
        
        <div className="order-detail-content">
          <div className="order-detail-main">
            <div className="order-timeline">
              <div className={`timeline-status ${getStatusClass(order.status)}`}>
                {getStatusIcon(order.status) && (
                  <span className="timeline-icon">{getStatusIcon(order.status)}</span>
                )}
                <h2>{ORDER_STATUS_TEXT[order.status]}</h2>
                <p className="timeline-date">{formatDate(order.statusDate)}</p>
                <p className="timeline-description">{order.statusDescription}</p>
              </div>
              
              {order.status === 'delivered' && canReturnOrder(order) && (
                <Link 
                  to={`/cuenta/pedidos/${order.id}/devolucion`}
                  className="btn btn-secondary"
                >
                  Solicitar devolución
                </Link>
              )}
              
              {order.status === 'return_in_progress' && order.returnTracking && (
                <div className="return-tracking">
                  <h3>Información de devolución</h3>
                  <p>Número de seguimiento: <strong>{order.returnTracking}</strong></p>
                  <p>Paquetería: {order.returnCarrier}</p>
                </div>
              )}
            </div>
            
            <div className="order-items">
              <h3>Productos</h3>
              {order.items.map(item => (
                <div key={item.id} className="order-item">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    {item.variant && <p className="item-variant">{item.variant}</p>}
                    <p className="item-quantity">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-line">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="total-line">
                  <span>Descuento</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="total-line">
                <span>Envío</span>
                <span>{order.shipping > 0 ? formatPrice(order.shipping) : 'Gratis'}</span>
              </div>
              <div className="total-line">
                <span>Impuestos</span>
                <span>{formatPrice(order.taxes)}</span>
              </div>
              <div className="total-line total-final">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
          
          <div className="order-detail-sidebar">
            <div className="info-section">
              <h3>Información de contacto</h3>
              <p>{order.customer.name}</p>
              <p>{order.customer.email}</p>
              {order.customer.phone && <p>{order.customer.phone}</p>}
            </div>
            
            <div className="info-section">
              <h3>Pago</h3>
              <p>{order.payment.method}</p>
              {order.payment.last4 && <p>•••• {order.payment.last4}</p>}
              <p>{formatPrice(order.total)}</p>
              <p className="payment-date">{formatDate(order.payment.date)}</p>
            </div>
            
            <div className="info-section">
              <h3>Dirección de envío</h3>
              <p>{order.shipping_address.name}</p>
              <p>{order.shipping_address.street}</p>
              {order.shipping_address.apartment && <p>{order.shipping_address.apartment}</p>}
              <p>{order.shipping_address.postalCode} {order.shipping_address.city}</p>
              <p>{order.shipping_address.state}</p>
              <p>{order.shipping_address.country}</p>
            </div>
            
            {order.billing_address && (
              <div className="info-section">
                <h3>Dirección de facturación</h3>
                <p>{order.billing_address.name}</p>
                <p>{order.billing_address.street}</p>
                {order.billing_address.apartment && <p>{order.billing_address.apartment}</p>}
                <p>{order.billing_address.postalCode} {order.billing_address.city}</p>
                <p>{order.billing_address.state}</p>
                <p>{order.billing_address.country}</p>
              </div>
            )}
            
            <div className="info-section">
              <h3>Método de envío</h3>
              <p>{order.shipping_method.name}</p>
              {order.shipping_method.tracking && (
                <p>Rastreo: <strong>{order.shipping_method.tracking}</strong></p>
              )}
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

export default OrderDetailPage;