import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatPrice } from '../../utils/validation';
import { ORDER_STATUS_TEXT } from '../../utils/constants';
import OrderActions from './OrderActions';
import './OrderList.css';

const OrderList = ({ orders, onBuyAgain, onDownloadInvoice }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
      case 'delivered':
        return 'status-badge-success';
      case 'cancelled':
      case 'refunded':
        return 'status-badge-error';
      case 'return_in_progress':
        return 'status-badge-warning';
      default:
        return '';
    }
  };

  return (
    <div className="orders-list">
      <div className="list-header">
        <div className="list-col-order">Pedido</div>
        <div className="list-col-status">Estado</div>
        <div className="list-col-total">Total</div>
        <div className="list-col-actions"></div>
      </div>
      
      {orders.map(order => (
        <div key={order.id} className="list-item">
          <div className="list-col-order">
            <Link to={`/cuenta/pedidos/${order.id}`} className="order-link">
              <div className="order-image-info">
                <img
                  src={order.items[0]?.image}
                  alt={order.items[0]?.name}
                  className="list-order-image"
                />
                <div className="order-details">
                  <span className="order-number">#{order.number}</span>
                  <span className="order-info">
                    {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'} • {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="list-col-status">
            <span className={`status-badge ${getStatusClass(order.status)}`}>
              {ORDER_STATUS_TEXT[order.status]}
            </span>
          </div>
          
          <div className="list-col-total">
            {formatPrice(order.total)}
          </div>
          
          <div className="list-col-actions">
            <OrderActions
              orderId={order.id}
              orderNumber={order.number}
              status={order.status}
              deliveryDate={order.deliveryDate}
              onBuyAgain={onBuyAgain}
              onDownloadInvoice={onDownloadInvoice}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;