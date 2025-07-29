import React, { useState, useEffect } from 'react';
import { accountAPI, trackEvent } from '../utils/api';
import AccountHeader from '../components/account/AccountHeader';
import OrderGrid from '../components/account/OrderGrid';
import OrderList from '../components/account/OrderList';
import Button from '../components/shared/Button';
import Loader from '../components/shared/Loader';
import Toast from '../components/shared/Toast';
import './AccountPage.css';

const AccountPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sort: 'date-desc'
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadOrders = async () => {
    try {
      const response = await accountAPI.getOrders(filters);
      setOrders(response.orders);
    } catch (error) {
      setToast({ message: 'Error al cargar pedidos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyAgain = async (orderId) => {
    try {
      trackEvent('volver_a_comprar', { orderId });
      const response = await accountAPI.buyAgain(orderId);
      
      if (response.success) {
        setToast({ 
          message: `${response.itemsAdded} productos agregados al carrito`, 
          type: 'success' 
        });
        
        // Redirigir al carrito después de 2 segundos
        setTimeout(() => {
          window.location.href = '/carrito';
        }, 2000);
      } else if (response.partial) {
        setToast({ 
          message: `Solo ${response.itemsAdded} de ${response.totalItems} productos disponibles`, 
          type: 'warning' 
        });
      }
    } catch (error) {
      setToast({ message: 'Error al agregar productos', type: 'error' });
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      await accountAPI.downloadInvoice(orderId);
      trackEvent('factura_descargada', { orderId });
    } catch (error) {
      setToast({ message: 'Error al descargar factura', type: 'error' });
    }
  };

  const toggleView = () => {
    const newView = view === 'grid' ? 'list' : 'grid';
    setView(newView);
    trackEvent('cambio_vista_pedidos', { view: newView });
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="account-container">
        <AccountHeader currentPage="pedidos" />
        <div className="loader-page">
          <Loader size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <AccountHeader currentPage="pedidos" />
      
      <div className="account-content">
        <div className="orders-header">
          <h1>Pedidos</h1>
          <div className="orders-controls">
            <button
              onClick={toggleView}
              className="view-toggle"
              aria-label={`Cambiar a vista ${view === 'grid' ? 'lista' : 'galería'}`}
            >
              {view === 'grid' ? '☰ Lista' : '⊞ Galería'}
            </button>
            <button
              onClick={() => setShowFilters(true)}
              className="filter-btn"
              aria-label="Filtrar y ordenar"
            >
              ≡
            </button>
          </div>
        </div>
        
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛍️</div>
            <h2>Aún no tienes pedidos</h2>
            <p>Cuando hagas tu primera compra, aparecerá aquí.</p>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/'}
            >
              Ir a la tienda
            </Button>
          </div>
        ) : (
          view === 'grid' ? (
            <OrderGrid 
              orders={orders}
              onBuyAgain={handleBuyAgain}
              onDownloadInvoice={handleDownloadInvoice}
            />
          ) : (
            <OrderList 
              orders={orders}
              onBuyAgain={handleBuyAgain}
              onDownloadInvoice={handleDownloadInvoice}
            />
          )
        )}
      </div>
      
      {showFilters && (
        <FilterModal
          currentFilters={filters}
          onApply={applyFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
      
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

// Modal de filtros
const FilterModal = ({ currentFilters, onApply, onClose }) => {
  const [filters, setFilters] = useState(currentFilters);

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="filter-modal">
        <div className="modal-header">
          <h2>Ordenar y filtrar</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          <h3>Ordenar por</h3>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="radio"
                name="sort"
                value="date-desc"
                checked={filters.sort === 'date-desc'}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              />
              Del más reciente al más antiguo
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="sort"
                value="date-asc"
                checked={filters.sort === 'date-asc'}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              />
              Del más antiguo al más reciente
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="sort"
                value="number-desc"
                checked={filters.sort === 'number-desc'}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              />
              Número de pedido (de mayor a menor)
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="sort"
                value="number-asc"
                checked={filters.sort === 'number-asc'}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              />
              Número de pedido (de menor a mayor)
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="sort"
                value="total-desc"
                checked={filters.sort === 'total-desc'}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              />
              Total del pedido (de mayor a menor)
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="sort"
                value="total-asc"
                checked={filters.sort === 'total-asc'}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              />
              Total del pedido (de menor a mayor)
            </label>
          </div>
        </div>
        
        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setFilters(currentFilters)}>
            Borrar todo
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Aplicar
          </Button>
        </div>
      </div>
    </>
  );
};

export default AccountPage;