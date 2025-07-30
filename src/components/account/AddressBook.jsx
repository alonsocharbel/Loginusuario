import React, { useState } from 'react';
import './AddressBook.css';

const AddressBook = ({ addresses = [], onEdit, onDelete, onSetDefault }) => {
  const [editingId, setEditingId] = useState(null);

  const handleEdit = (addressId) => {
    setEditingId(addressId);
    if (onEdit) {
      onEdit(addressId);
    }
  };

  const handleDelete = (addressId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      if (onDelete) {
        onDelete(addressId);
      }
    }
  };

  const handleSetDefault = (addressId) => {
    if (onSetDefault) {
      onSetDefault(addressId);
    }
  };

  if (addresses.length === 0) {
    return (
      <div className="address-book-empty">
        <p>No tienes direcciones guardadas</p>
      </div>
    );
  }

  return (
    <div className="address-book">
      {addresses.map((address) => (
        <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
          {address.isDefault && (
            <span className="default-badge">Dirección predeterminada</span>
          )}
          
          <div className="address-content">
            <p className="address-name">{address.name}</p>
            <p>{address.street}</p>
            {address.street2 && <p>{address.street2}</p>}
            <p>
              {address.postalCode} {address.city}, {address.state}
            </p>
            <p>{address.country}</p>
            {address.phone && <p>{address.phone}</p>}
          </div>
          
          <div className="address-actions">
            <button 
              className="btn-icon" 
              onClick={() => handleEdit(address.id)}
              aria-label="Editar dirección"
            >
              ✏️
            </button>
            {!address.isDefault && (
              <>
                <button 
                  className="btn-text"
                  onClick={() => handleSetDefault(address.id)}
                >
                  Hacer predeterminada
                </button>
                <button 
                  className="btn-icon"
                  onClick={() => handleDelete(address.id)}
                  aria-label="Eliminar dirección"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressBook;
