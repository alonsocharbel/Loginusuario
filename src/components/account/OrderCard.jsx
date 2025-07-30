import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatPrice } from '../../utils/validation';
import { ORDER_STATUS_TEXT } from '../../utils/constants';
import OrderActions from './OrderActions';
import Button from '../shared/Button';
import './OrderCard.css';

const OrderCard = ({ order, onBuyAgain, onDownloadInvoice }) => {
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

  return (
    <div className="order-card">
      <div className={`order-status ${getStatusClass(order.status)}`}>
        {getStatusIcon(order.status) && (
          <span className="status-icon">{getStatusIcon(order.status)}</span>
        )}
        <span className="status-text">{ORDER_STATUS_TEXT[order.status]}</span>
      </div>
      
      <div className="order-date">{formatDate(order.date || order.createdAt)}</div>
      
      <Link to={`/cuenta/pedidos/${order.id}`} className="order-images-link">
        <div className="order-images">
          {order.items.slice(0, 3).map((item, idx) => (
            <img
              key={idx}
              src={item.image}
              alt={item.name}
              className="order-item-image"
            />
          ))}
          {order.items.length > 3 && (
            <span className="more-items">+{order.items.length - 3}</span>
          )}
        </div>
      </Link>
      
      <div className="order-info">
        <span className="item-count">
          {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
        </span>
        <span className="order-number">#{order.number}</span>
      </div>
      
      <div className="order-total">{formatPrice(order.total, order.currency)}</div>
      
      <Button
        variant="secondary"
        fullWidth
        onClick={() => onBuyAgain(order.id)}
        className="buy-again-btn"
      >
        Volver a comprar
      </Button>
      
      <OrderActions
        orderId={order.id}
        orderNumber={order.number}
        status={order.status}
        deliveryDate={order.deliveryDate}
        onBuyAgain={onBuyAgain}
        onDownloadInvoice={onDownloadInvoice}
      />
    </div>
  );
};

export default OrderCard;