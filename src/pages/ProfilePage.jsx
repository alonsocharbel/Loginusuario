import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { accountAPI } from '../utils/api';
import AccountHeader from '../components/account/AccountHeader';
import AddressBook from '../components/account/AddressBook';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import Toast from '../components/shared/Toast';
import Loader from '../components/shared/Loader';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [profileData, addressesData] = await Promise.all([
        accountAPI.getProfile(),
        accountAPI.getAddresses()
      ]);
      
      setProfile({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || ''
      });
      setAddresses(addressesData.addresses || []);
    } catch (error) {
      setToast({ message: 'Error al cargar perfil', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async () => {
    setSaving(true);
    try {
      await accountAPI.updateProfile({ name: profile.name });
      setToast({ message: 'Nombre actualizado', type: 'success' });
      setEditingName(false);
      // Actualizar contexto de auth
      if (user) {
        setUser({ ...user, name: profile.name });
      }
    } catch (error) {
      setToast({ message: 'Error al actualizar nombre', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePhone = async () => {
    setSaving(true);
    try {
      await accountAPI.updateProfile({ phone: profile.phone });
      setToast({ message: 'Teléfono actualizado', type: 'success' });
      setEditingPhone(false);
    } catch (error) {
      setToast({ message: 'Error al actualizar teléfono', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddressUpdate = (updatedAddresses) => {
    setAddresses(updatedAddresses);
  };

  if (loading) {
    return (
      <div className="account-container">
        <AccountHeader currentPage="perfil" />
        <div className="loader-page">
          <Loader size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <AccountHeader currentPage="perfil" />
      
      <div className="account-content">
        <h1>Perfil</h1>
        
        <div className="profile-section">
          {editingName ? (
            <div className="edit-field">
              <Input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Nombre completo"
                autoFocus
              />
              <div className="edit-actions">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    setEditingName(false);
                    setProfile({ ...profile, name: user?.name || '' });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleSaveName}
                  loading={saving}
                  disabled={!profile.name.trim()}
                >
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <div className="profile-name">
              <span>{profile.name || 'Sin nombre'}</span>
              <button
                onClick={() => setEditingName(true)}
                className="edit-btn"
                aria-label="Editar nombre"
              >
                ✏️
              </button>
            </div>
          )}
          
          <div className="profile-grid">
            <div className="profile-field">
              <label>Correo electrónico</label>
              <p className="profile-value">{profile.email}</p>
              <p className="profile-note">No se puede cambiar</p>
            </div>
            
            <div className="profile-field">
              <label>Número de teléfono</label>
              {editingPhone ? (
                <div className="edit-field-inline">
                  <Input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="Teléfono móvil"
                    autoFocus
                  />
                  <div className="edit-actions">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => {
                        setEditingPhone(false);
                        loadProfile();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={handleSavePhone}
                      loading={saving}
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="profile-value">{profile.phone || 'No agregado'}</p>
                  <button
                    onClick={() => setEditingPhone(true)}
                    className="link-button"
                  >
                    {profile.phone ? 'Editar' : 'Agregar'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="addresses-section">
          <div className="section-header">
            <h2>Direcciones</h2>
          </div>
          
          <AddressBook
            addresses={addresses}
            onUpdate={handleAddressUpdate}
            onError={(message) => setToast({ message, type: 'error' })}
          />
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

export default ProfilePage;