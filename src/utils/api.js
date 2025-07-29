// API base URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

// Helper para obtener token
const getToken = () => {
  return localStorage.getItem('t1_auth_token');
};

// Helper para headers con auth
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Manejo de errores de API
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `Error ${response.status}`);
  }
  return response.json();
};

// Auth API
export const authAPI = {
  // Enviar código OTP
  sendCode: async (emailOrPhone) => {
    const response = await fetch(`${API_BASE}/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: emailOrPhone })
    });
    return handleApiResponse(response);
  },
  
  // Verificar código
  verifyCode: async (emailOrPhone, code) => {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: emailOrPhone, code })
    });
    return handleApiResponse(response);
  },
  
  // Reenviar código
  resendCode: async (emailOrPhone) => {
    const response = await fetch(`${API_BASE}/auth/resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: emailOrPhone })
    });
    return handleApiResponse(response);
  },
  
  // Cerrar sesión
  logout: async () => {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },
  
  // Verificar sesión
  verifySession: async () => {
    const response = await fetch(`${API_BASE}/auth/verify-session`, {
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  }
};

// Account API
export const accountAPI = {
  // Obtener perfil
  getProfile: async () => {
    const response = await fetch(`${API_BASE}/account/profile`, {
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },
  
  // Actualizar perfil
  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE}/account/profile`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleApiResponse(response);
  },
  
  // Obtener pedidos
  getOrders: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/account/orders?${query}`, {
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },
  
  // Obtener detalle de pedido
  getOrderDetail: async (orderId) => {
    const response = await fetch(`${API_BASE}/account/orders/${orderId}`, {
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },
  
  // Volver a comprar
  buyAgain: async (orderId) => {
    const response = await fetch(`${API_BASE}/account/orders/${orderId}/buy-again`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },
  
  // Descargar factura
  downloadInvoice: async (orderId) => {
    const response = await fetch(`${API_BASE}/account/orders/${orderId}/invoice`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al descargar factura');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `factura-${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
  
  // Iniciar devolución
  startReturn: async (orderId, data) => {
    const response = await fetch(`${API_BASE}/account/orders/${orderId}/return`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleApiResponse(response);
  },
  
  // Obtener direcciones
  getAddresses: async () => {
    const response = await fetch(`${API_BASE}/account/addresses`, {
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },
  
  // Crear dirección
  createAddress: async (data) => {
    const response = await fetch(`${API_BASE}/account/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleApiResponse(response);
  },
  
  // Actualizar dirección
  updateAddress: async (addressId, data) => {
    const response = await fetch(`${API_BASE}/account/addresses/${addressId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleApiResponse(response);
  },
  
  // Eliminar dirección
  deleteAddress: async (addressId) => {
    const response = await fetch(`${API_BASE}/account/addresses/${addressId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },
  
  // Cerrar todas las sesiones
  closeAllSessions: async () => {
    const response = await fetch(`${API_BASE}/account/close-all-sessions`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  }
};

// T1 Pay API
export const t1PayAPI = {
  // Obtener URL de autenticación
  getAuthUrl: () => {
    const clientId = process.env.REACT_APP_T1_PAY_CLIENT_ID;
    const redirectUri = `${window.location.origin}/cuenta/login/t1pay-callback`;
    const t1PayUrl = process.env.REACT_APP_T1_PAY_URL;
    
    return `${t1PayUrl}/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  },
  
  // Intercambiar código por token
  exchangeCode: async (code) => {
    const response = await fetch(`${API_BASE}/auth/t1pay/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    return handleApiResponse(response);
  }
};

// Analytics API
export const trackEvent = (eventName, properties = {}) => {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }
  
  // Analytics personalizado
  fetch(`${API_BASE}/analytics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      event: eventName, 
      properties,
      timestamp: new Date().toISOString()
    })
  }).catch(() => {
    // Silenciar errores de analytics
  });
};
