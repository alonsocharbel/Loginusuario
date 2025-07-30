# Login Usuario T1tienda

Sistema de autenticación y portal de clientes para T1tienda, basado en React con diseño inspirado en Shopify.

## Características

- 🔐 Login sin contraseña con código OTP
- 🛍️ Vista de pedidos del cliente
- 👤 Perfil y configuración de cuenta
- 🔴 Integración con T1 Pay
- 📱 Diseño responsive
- 🎨 Sistema de diseño T1 (colores y tipografía)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/login-usuario-t1tienda.git

# Instalar dependencias
cd login-usuario-t1tienda
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_T1_PAY_CLIENT_ID=tu_client_id_aqui
REACT_APP_API_URL=https://api.tudominio.com
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# El proyecto estará disponible en http://localhost:3000
```

### Credenciales de prueba
- **Email**: Cualquier email válido
- **Código OTP**: `123456`

## Producción

```bash
# Construir para producción
npm run build

# La carpeta 'build' contendrá los archivos optimizados
```

## Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables
├── pages/          # Páginas principales
├── utils/          # Utilidades y helpers
├── styles/         # Estilos globales
└── App.jsx         # Componente principal
```

## Despliegue en Vercel

1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno en el panel de Vercel
3. Deploy automático en cada push a la rama main

## Tecnologías

- React 18
- React Router v6
- CSS Modules
- Sistema de diseño T1

## Licencia

Privado - T1tienda
