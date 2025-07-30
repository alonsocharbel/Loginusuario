import React, { useState } from 'react';
import Input from '../shared/Input';
import Button from '../shared/Button';
import './ProfileForm.css';

const ProfileForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  };

  const handleSave = async (field) => {
    const newErrors = {};

    if (field === 'name' && !formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (field === 'phone' && formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSave({ [field]: formData[field] });
      setEditingField(null);
    } catch (error) {
      setErrors({ [field]: 'Error al guardar. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (field) => {
    setFormData(prev => ({ ...prev, [field]: user[field] || '' }));
    setEditingField(null);
    setErrors({});
  };

  return (
    <div className="profile-form">
      <div className="profile-field">
        <label>Nombre completo</label>
        {editingField === 'name' ? (
          <div className="field-edit">
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              autoFocus
            />
            <div className="field-actions">
              <Button
                size="small"
                onClick={() => handleSave('name')}
                loading={loading}
              >
                Guardar
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleCancel('name')}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="field-display">
            <span>{user?.name || 'No especificado'}</span>
            <button 
              className="edit-btn"
              onClick={() => setEditingField('name')}
              aria-label="Editar nombre"
            >
              ✏️
            </button>
          </div>
        )}
      </div>

      <div className="profile-grid">
        <div className="profile-field">
          <label>Correo electrónico</label>
          <div className="field-display">
            <span>{user?.email}</span>
            <span className="field-note">No editable por seguridad</span>
          </div>
        </div>

        <div className="profile-field">
          <label>Número de teléfono</label>
          {editingField === 'phone' ? (
            <div className="field-edit">
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="+52 55 1234 5678"
                autoFocus
              />
              <div className="field-actions">
                <Button
                  size="small"
                  onClick={() => handleSave('phone')}
                  loading={loading}
                >
                  Guardar
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleCancel('phone')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="field-display">
              <span>{user?.phone || 'No agregado'}</span>
              <button 
                className="link-button"
                onClick={() => setEditingField('phone')}
              >
                {user?.phone ? 'Editar' : 'Agregar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
