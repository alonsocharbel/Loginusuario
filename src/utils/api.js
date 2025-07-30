// API base URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

// Mock mode - TEMPORAL: Siempre usar mock hasta tener API real
const USE_MOCK_API = true; // Cambiado para siempre usar mock

// Mock data para desarrollo
const mockData = {
  orders: [
    {
      id: '1060',
      number: '1060',
      status: 'confirmed',
      date: '2024-07-28',
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
      id: '1059',
      number: '1059',
      status: 'confirmed',
      date: '2024-07-28',
      total: 0.00,
      currency: 'MXN',
      items: []
    },
    {
      id: '1058',
      number: '1058',
      status: 'confirmed',
      date: '2024-07-28',
      total: 0.00,
      currency: 'MXN',
      items: []
    },
    {
      id: '1056',
      number: '1056',
      status: 'confirmed',
      date: '2024-07-25',
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
      date: '2024-07-24',
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
      date: '2024-07-24',
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
      id: '1051',
      number: '1051',
      status: 'cancelled',
      date: '2024-07-24',
      total: 0.00,
      currency: 'MXN',
      items: []
    },
    {
      id: '1016',
      number: '1016',
      status: 'cancelled',
      date: '2024-07-24',
      total: 0.00,
      currency: 'MXN',
      items: []
    },
    {
      id: '1014',
      number: '1014',
      status: 'cancelled',
      date: '2024-07-24',
      total: 0.00,
      currency: 'MXN',
      items: []
    },
    {
      id: '1008',
      number: '1008',
      status: 'cancelled',
      date: '2024-07-24',
      total: 0.00,
      currency: 'MXN',
      items: []
    },
    {
      id: '1006',
      number: '1006',
      status: 'delivered',
      date: '2024-06-27',
      total: 8348.52,
      currency: 'MXN',
      items: [
        {
          id: '5',
          name: 'Producto',
          price: 8348.52,
          quantity: 3,
          image: 'https://picsum.photos/150/150?random=7'
        }
      ]
    },
    {
      id: '1001',
      number: '1001',
      status: 'cancelled',
      date: '2024-06-24',
      total: 0.00,
      currency: 'MXN',
      items: []
    }
  ],
  profile: {
    name: 'Alonso Charbel',
    email: 'alonsocharbel@gmail.com',
    phone: '+52 55 4800 1187',
    addresses: [
      {
        id: '1',
        isDefault: true,
        name: 'Alonso Charbel Moncada',
        street: 'Correo Mayor 94',
        street2: 'Entre mesones y republica salvador',
        city: 'Cuauhtémoc',
        state: 'Ciudad de México',
        postalCode: '06090',
        country: 'México',
        phone: '+525548001187'
      }
    ]
  }
};

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

// Simulador de latencia para mock
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

// Mock API handler
const mockApiHandler = async (url, options = {}) => {
  await mockDelay();
  console.log('[Mock API] Request:', url, options);
  
  // Auth endpoints
  if (url.includes('/auth/send-code')) {
    return { success: true, message: 'Código enviado (usa 123456)' };
  }
  
  if (url.includes('/auth/verify')) {
    const body = JSON.parse(options.body || '{}');
    if (body.code === '123456') {
      // Generar token mock
      const mockToken = 'mock-token-' + Date.now();
      localStorage.setItem('t1_auth_token', mockToken);
      localStorage.setItem('t1_user_data', JSON.stringify(mockData.profile));
      
      return {
        success: true,
        token: mockToken,
        user: mockData.profile
      };
    }
    return { success: false, error: 'Código incorrecto (usa 123456)' };
  }
  
  if (url.includes('/auth/resend')) {
    return { success: true, message: 'Código reenviado (usa 123456)' };
  }
  
  if (url.includes('/auth/logout')) {
    localStorage.removeItem('t1_auth_token');
    localStorage.removeItem('t1_user_data');
    return { success: true };
  }
  
  if (url.includes('/auth/verify-session')) {
    const token = getToken();
    if (token) {
      return { valid: true, user: mockData.profile };
    }
    return { valid: false };
  }
  
  // Account endpoints (requieren auth)
  const token = getToken();
  if (!token && url.includes('/account/')) {
    throw new Error('No autorizado');
  }
  
  if (url.includes('/account/profile')) {
    if (options.method === 'PATCH') {
      const updates = JSON.parse(options.body || '{}');
      Object.assign(mockData.profile, updates);
      localStorage.setItem('t1_user_data', JSON.stringify(mockData.profile));
      return { success: true, profile: mockData.profile };
    }
    return mockData.profile;
  }
  
  if (url.includes('/account/orders')) {
    if (url.includes('buy-again')) {
      return { success: true, itemsAdded: 2, message: '2 productos agregados al carrito' };
    }
    
    // Detalle de orden
    const orderMatch = url.match(/\/orders\/(\d+)$/);
    if (orderMatch) {
      const orderId = orderMatch[1];
      const order = mockData.orders.find(o => o.id === orderId);
      if (order) {
        return order;
      }
      throw new Error('Pedido no encontrado');
    }
    
    // Lista de órdenes
    // Verificar si hay override de pedidos para demos
    const orders = window.__T1_MOCK_ORDERS_OVERRIDE__ !== undefined 
      ? window.__T1_MOCK_ORDERS_OVERRIDE__ 
      : mockData.orders;
    return { orders, total: orders.length };
  }
  
  if (url.includes('/account/close-all-sessions')) {
    localStorage.removeItem('t1_auth_token');
    localStorage.removeItem('t1_user_data');
    return { success: true, message: 'Todas las sesiones cerradas' };
  }
  
  throw new Error('Endpoint no encontrado en mock');
};

// Manejo de errores de API
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `Error ${response.status}`);
  }
  return response.json();
};

// Wrapper para API calls
const apiCall = async (url, options = {}) => {
  if (USE_MOCK_API) {
    try {
      return await mockApiHandler(url, options);
    } catch (error) {
      throw error;
    }
  }
  
  const response = await fetch(url, options);
  return handleApiResponse(response);
};

// Auth API
export const authAPI = {
  // Enviar código OTP
  sendCode: async (emailOrPhone) => {
    return apiCall(`${API_BASE}/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: emailOrPhone })
    });
  },
  
  // Verificar código
  verifyCode: async (emailOrPhone, code) => {
    return apiCall(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: emailOrPhone, code })
    });
  },
  
  // Reenviar código
  resendCode: async (emailOrPhone) => {
    return apiCall(`${API_BASE}/auth/resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: emailOrPhone })
    });
  },
  
  // Cerrar sesión
  logout: async () => {
    return apiCall(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  },
  
  // Verificar sesión
  verifySession: async () => {
    return apiCall(`${API_BASE}/auth/verify-session`, {
      headers: getAuthHeaders()
    });
  }
};

// Account API
export const accountAPI = {
  // Obtener perfil
  getProfile: async () => {
    return apiCall(`${API_BASE}/account/profile`, {
      headers: getAuthHeaders()
    });
  },
  
  // Actualizar perfil
  updateProfile: async (data) => {
    return apiCall(`${API_BASE}/account/profile`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
  },
  
  // Obtener pedidos
  getOrders: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`${API_BASE}/account/orders?${query}`, {
      headers: getAuthHeaders()
    });
  },
  
  // Obtener detalle de pedido
  getOrderDetail: async (orderId) => {
    return apiCall(`${API_BASE}/account/orders/${orderId}`, {
      headers: getAuthHeaders()
    });
  },
  
  // Volver a comprar
  buyAgain: async (orderId) => {
    return apiCall(`${API_BASE}/account/orders/${orderId}/buy-again`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  },
  
  // Descargar factura
  downloadInvoice: async (orderId) => {
    if (USE_MOCK_API) {
      alert('Descarga de factura simulada para pedido #' + orderId);
      return;
    }
    
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
    return apiCall(`${API_BASE}/account/orders/${orderId}/return`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
  },
  
  // Obtener direcciones
  getAddresses: async () => {
    if (USE_MOCK_API) {
      return { addresses: mockData.profile.addresses };
    }
    return apiCall(`${API_BASE}/account/addresses`, {
      headers: getAuthHeaders()
    });
  },
  
  // Cerrar todas las sesiones
  closeAllSessions: async () => {
    return apiCall(`${API_BASE}/account/close-all-sessions`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  }
};

// T1 Pay API
export const t1PayAPI = {
  // Obtener URL de autenticación
  getAuthUrl: () => {
    const clientId = process.env.REACT_APP_T1_PAY_CLIENT_ID;
    const redirectUri = `${window.location.origin}/cuenta/login/t1pay-callback`;
    const t1PayUrl = process.env.REACT_APP_T1_PAY_URL || 'https://pay.t1pagos.com';
    
    return `${t1PayUrl}/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  },
  
  // Intercambiar código por token
  exchangeCode: async (code) => {
    return apiCall(`${API_BASE}/auth/t1pay/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
  }
};

// Analytics API
export const trackEvent = (eventName, properties = {}) => {
  if (USE_MOCK_API) {
    console.log('[Analytics]', eventName, properties);
    return;
  }
  
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

// Export para debugging
if (process.env.NODE_ENV === 'development') {
  window.__T1_MOCK_DATA__ = mockData;
  window.__T1_USE_MOCK__ = USE_MOCK_API;
}
