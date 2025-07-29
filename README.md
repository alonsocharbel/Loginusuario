# Login Usuario T1tienda

Sistema de autenticación y portal de clientes para T1tienda, basado en React.

## Características

- 🔐 Autenticación sin contraseña mediante código OTP
- 📱 Mobile-first y totalmente responsive
- 🎨 Sistema de diseño T1 con colores y tipografía Manrope
- 🛍️ Portal de pedidos con funcionalidad "Volver a comprar"
- 🔄 Gestión de devoluciones integrada
- 💳 Integración con T1 Pay (cuando T1pagos está activo)

## Instalación

```bash
# Instalar dependencias
npm install

# Crear archivo .env basado en .env.example
cp .env.example .env

# Iniciar servidor de desarrollo
npm start
```

## Estructura del Proyecto

```
login-usuario/
├── src/
│   ├── components/
│   │   ├── auth/           # Componentes de autenticación
│   │   ├── account/        # Componentes del portal de cuenta
│   │   └── shared/         # Componentes compartidos
│   ├── pages/              # Páginas principales
│   ├── utils/              # Utilidades y helpers
│   ├── styles/             # Estilos globales
│   └── App.jsx             # Componente principal
├── public/                 # Assets públicos
└── package.json
```

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm run lint` - Ejecuta el linter
- `npm run format` - Formatea el código con Prettier

## Variables de Entorno

```env
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_T1_PAY_URL=https://pay.t1pagos.com
REACT_APP_T1_PAY_CLIENT_ID=your_client_id
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

## Despliegue

### GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[tu-usuario]/login-usuario-t1tienda.git
git push -u origin main
```

### Vercel

1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Deploy automático en cada push a main

## Tecnologías Utilizadas

- React 18
- React Router v6
- CSS Modules
- Sistema de diseño T1

## Licencia

Propiedad de T1
