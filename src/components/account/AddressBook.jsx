import React, { useState } from 'react';
import { accountAPI } from '../../utils/api';
import Button from '../shared/Button';
import Input from '../shared/Input';
import './AddressBook.css';

const AddressBook = ({ addresses, onUpdate, onError }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    apartment: '',
    postalCode: '',
    city: '',
    state: '',
    country: 'México',
    phone: '',
    isDefault: false
  });

  const resetForm = () => {
    setFormData({
      name: '',
      street: '',
      apartment: '',
      postalCode: '',
      city: '',
      state: '',
      country: 'México',
      phone: '',
      isDefault: false
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowAddForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let updatedAddresses;
      
      if (editingId) {
        await accountAPI.updateAddress(editingId, formData);
        updatedAddresses = addresses.map(addr => 
          addr.id === editingId ? { ...addr, ...formData } : addr
        );
      } else {
        const response = await accountAPI.createAddress(formData);
        updatedAddresses = [...addresses, response.address];
      }
      
      // Si es default, actualizar las demás
      if (formData.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === (editingId || response.address.id)
        }));
      }
      
      onUpdate(updatedAddresses);
      resetForm();
    } catch (error) {
      onError('Error al guardar dirección');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta dirección?')) return;
    
    try {
      await accountAPI.deleteAddress(id);
      onUpdate(addresses.filter(addr => addr.id !== id));
    } catch (error) {
      onError('Error al eliminar dirección');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await accountAPI.updateAddress(id, { isDefault: true });
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));
      onUpdate(updatedAddresses);
    } catch (error) {
      onError('Error al actualizar dirección');
    }
  };

  return (
    <div className="address-book">
      {addresses.length === 0 && !showAddForm && (
        <div className="empty-addresses">
          <p>No tienes direcciones guardadas</p>
        </div>
      )}
      
      <div className="addresses-grid">
        {addresses.map(address => (
          <div key={address.id} className="address-card">
            {address.isDefault && (
              <span className="default-badge">Predeterminada</span>
            )}
            
            <h3>{address.name}</h3>
            <p className="address-text">
              {address.street}<br />
              {address.apartment && <>{address.apartment}<br /></>}
              {address.postalCode} {address.city}, {address.state}<br />
              {address.country}<br />
              {address.phone}
            </p>
            
            <div className="address-actions">
              <button
                onClick={() => handleEdit(address)}
                className="link-button"
              >
                Editar
              </button>
              
              {!address.isDefault && (
                <>
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="link-button"
                  >
                    Hacer predeterminada
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="link-button link-danger"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {!showAddForm && addresses.length < 10 && (
        <Button
          variant="secondary"
          onClick={() => setShowAddForm(true)}
          className="add-address-btn"
        >
          + Agregar dirección
        </Button>
      )}
      
      {showAddForm && (
        <div className="address-form">
          <h3>{editingId ? 'Editar dirección' : 'Nueva dirección'}</h3>
          
          <div className="form-grid">
            <Input
              label="Nombre completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            
            <Input
              label="Teléfono"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            
            <Input
              label="Calle y número"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              required
              className="full-width"
            />
            
            <Input
              label="Colonia, apartamento, etc. (opcional)"
              value={formData.apartment}
              onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
              className="full-width"
            />
            
            <Input
              label="Código postal"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              required
            />
            
            <Input
              label="Ciudad"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
            
            <Input
              label="Estado"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
            />
            
            <Input
              label="País"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
              disabled
            />
          </div>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            />
            Establecer como dirección predeterminada
          </label>
          
          <div className="form-actions">
            <Button
              variant="secondary"
              onClick={resetForm}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={saving}
              disabled={!formData.name || !formData.street || !formData.postalCode || !formData.city || !formData.state || !formData.phone}
            >
              {editingId ? 'Guardar cambios' : 'Agregar dirección'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBook;