// Configuración de OTP (parametrizable)
export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 5,
  MAX_ATTEMPTS: 5,
  BLOCK_DURATION_MINUTES: 30,
  RESEND_COOLDOWN_SECONDS: 30,
  MAX_RESENDS_PER_SESSION: 3,
  MAX_DAILY_ATTEMPTS: 10,
};

// Estados de autenticación
export const AUTH_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  CODE_SENT: 'code_sent',
  VERIFYING: 'verifying',
  SUCCESS: 'success',
  ERROR: 'error',
  BLOCKED: 'blocked'
};

// Tipos de errores
export const ERROR_TYPES = {
  INVALID_FORMAT: 'El formato del email o teléfono no es válido',
  CODE_EXPIRED: 'El código ha expirado. Solicita uno nuevo',
  INVALID_CODE: 'Código incorrecto. Intenta nuevamente',
  MAX_ATTEMPTS: 'Has alcanzado el número máximo de intentos',
  RESEND_LIMIT: 'Has solicitado demasiados códigos. Intenta más tarde',
  NETWORK_ERROR: 'Error de conexión. Intenta nuevamente',
  EMAIL_BOUNCED: 'No pudimos enviar el código. Verifica tu email'
};

// Configuración de sesión
export const SESSION_CONFIG = {
  TOKEN_KEY: 't1_auth_token',
  USER_KEY: 't1_user_data',
  EXPIRY_HOURS: 24,
  REFRESH_THRESHOLD_MINUTES: 30
};

// Estados de pedidos
export const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  RETURN_IN_PROGRESS: 'return_in_progress'
};

// Mapeo de estados a texto UI
export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING_PAYMENT]: 'Pendiente de pago',
  [ORDER_STATUS.CONFIRMED]: 'Confirmado',
  [ORDER_STATUS.PROCESSING]: 'En proceso',
  [ORDER_STATUS.SHIPPED]: 'Enviado',
  [ORDER_STATUS.DELIVERED]: 'Entregado',
  [ORDER_STATUS.CANCELLED]: 'Cancelado',
  [ORDER_STATUS.REFUNDED]: 'Reembolsado',
  [ORDER_STATUS.RETURN_IN_PROGRESS]: 'Devolución en curso'
};
