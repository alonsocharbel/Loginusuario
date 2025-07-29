import React from 'react';
import OrderCard from './OrderCard';
import './OrderGrid.css';

const OrderGrid = ({ orders, onBuyAgain, onDownloadInvoice }) => {
  return (
    <div className="orders-grid">
      {orders.map(order => (
        <OrderCard
          key={order.id}
          order={order}
          onBuyAgain={onBuyAgain}
          onDownloadInvoice={onDownloadInvoice}
        />
      ))}
    </div>
  );
};

export default OrderGrid;