import React, { useState, useEffect } from 'react';
import { trackEvent } from '../utils/api';
import AccountHeader from '../components/account/AccountHeader';
import OrderGrid from '../components/account/OrderGrid';
import OrderList from '../components/account/OrderList';
import Button from '../components/shared/Button';
import Loader from '../components/shared/Loader';
import Toast from '../components/shared/Toast';
import './AccountPage.css';

// Mock data directamente en el componente para testing
const mockOrders = [
  {
    id: '1060',
    number: '1060',
    status: 'confirmed',
    date: '2024-07-27',
    total: 17.40,
    currency: 'MXN',
    items: [
      {
        id: '1',
        name: 'Producto de prueba',
        price: 17.40,
        quantity: 1,
        image: 'https://picsum.photos/150/150?random=1',
        variant: null
      }
    ]
  },
  {
    id: '1056',
    number: '1056',
    status: 'delivered',
    date: '2024-07-24',
    deliveryDate: '2024-07-27',
    total: 2782.84,
    currency: 'MXN',
    items: [
      {
        id: '1',
        name: 'GRAV ORBIS LUME WATERPIPE (Copia)',
        price: 2782.84,
        quantity: 1,
        image: 'https://picsum.photos/150/150?random=5',
        variant: null
      }
    ]
  },
  {
    id: '1054',
    number: '1054',
    status: 'confirmed',
    date: '2024-07-23',
    total: 2550.84,
    currency: 'MXN',
    items: [
      {
        id: '2',
        name: 'WATERPIPE SILICONE 8 (Copia)',
        price: 2550.84,
        quantity: 1,
        image: 'https://picsum.photos/150/150?random=6',
        variant: null
      }
    ]
  },
  {
    id: '1053',
    number: '1053',
    status: 'confirmed',
    date: '2024-07-23',
    total: 4173.68,
    currency: 'MXN',
    items: [
      {
        id: '3',
        name: 'GRAV ORBIS LUME WATERPIPE (Copia)',
        price: 2999.00,
        quantity: 2,
        image: 'https://picsum.photos/150/150?random=6'
      }
    ]
  },
  {
    id: '1006',
    number: '1006',
    status: 'delivered',
    date: '2024-06-27',
    deliveryDate: '2024-07-01',
    total: 8348.52,
    currency: 'MXN',
    items: [
      {
        id: '5',
        name: 'Producto Premium',
        price: 8348.52,
        quantity: 3,
        image: 'https://picsum.photos/150/150?random=7'
      }
    ]
  }
];

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
    // Simular carga de pedidos
    console.log('Cargando pedidos mock...');
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  const handleBuyAgain = async (orderId) => {
    try {
      trackEvent('volver_a_comprar', { orderId });
      setToast({ 
        message: `Productos agregados al carrito (simulado)`, 
        type: 'success' 
      });
    } catch (error) {
      setToast({ message: 'Error al agregar productos', type: 'error' });
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      trackEvent('factura_descargada', { orderId });
      alert('Descarga de factura simulada para pedido #' + orderId);
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
            <h2>Aún no tienes ningún pedido</h2>
            <p>Ve a la tienda para realizar un pedido.</p>
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
