// Validación de email o teléfono
export const validateEmailOrPhone = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
  
  return {
    isValid: emailRegex.test(value) || phoneRegex.test(value),
    type: emailRegex.test(value) ? 'email' : phoneRegex.test(value) ? 'phone' : null
  };
};

// Validación de código OTP
export const validateOTPCode = (code) => {
  return /^\d{6}$/.test(code);
};

// Formatear precio en MXN
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(price);
};

// Formatear fecha
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  };
  return date.toLocaleDateString('es-MX', options);
};

// Enmascarar email
export const maskEmail = (email) => {
  const [localPart, domain] = email.split('@');
  const maskedLocal = localPart.slice(0, 2) + '***' + localPart.slice(-1);
  return `${maskedLocal}@${domain}`;
};

// Enmascarar teléfono
export const maskPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return `***${cleaned.slice(-4)}`;
};

// Detectar si es email o teléfono
export const detectInputType = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
  
  if (emailRegex.test(value)) return 'email';
  if (phoneRegex.test(value)) return 'phone';
  return null;
};

// Calcular tiempo restante
export const calculateTimeRemaining = (expiryTime) => {
  const now = Date.now();
  const remaining = expiryTime - now;
  
  if (remaining <= 0) return { expired: true, minutes: 0, seconds: 0 };
  
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  
  return { expired: false, minutes, seconds };
};

// Distancia de Levenshtein para sugerencias de typos
export const levenshteinDistance = (str1, str2) => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Verificar si el pedido puede ser devuelto
export const canReturnOrder = (order) => {
  if (order.status !== 'delivered') return false;
  
  const deliveryDate = new Date(order.deliveryDate);
  const daysSinceDelivery = Math.floor((Date.now() - deliveryDate) / (1000 * 60 * 60 * 24));
  const returnPeriodDays = 30; // Configurable
  
  return daysSinceDelivery <= returnPeriodDays;
};
