#!/bin/bash

# Script de configuración para Login Usuario T1tienda

echo "🚀 Configurando proyecto Login Usuario T1tienda..."

# Inicializar Git
echo "📦 Inicializando repositorio Git..."
git init

# Crear rama main
git checkout -b main

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "feat: Initial commit - Sistema de Login T1tienda

- Estructura completa del proyecto React
- Sistema de autenticación con OTP
- Portal de cuenta del cliente
- Vista de pedidos (grid y lista)
- Perfil y direcciones
- Detalle de pedido
- Sistema de devoluciones
- Integración con T1 Pay (cuando T1pagos está activo)
- Sistema de diseño T1 implementado
- Componentes reutilizables
- Responsive design
- Accesibilidad WCAG 2.1 AA"

echo "✅ Repositorio Git configurado"

# Instrucciones para el usuario
echo ""
echo "📋 Siguientes pasos:"
echo ""
echo "1. Instalar dependencias:"
echo "   npm install"
echo ""
echo "2. Crear archivo .env basado en .env.example:"
echo "   cp .env.example .env"
echo "   # Editar .env con tus valores"
echo ""
echo "3. Iniciar servidor de desarrollo:"
echo "   npm start"
echo ""
echo "4. Para subir a GitHub:"
echo "   # Crear repositorio en GitHub primero, luego:"
echo "   git remote add origin https://github.com/[tu-usuario]/login-usuario-t1tienda.git"
echo "   git push -u origin main"
echo ""
echo "5. Para desplegar en Vercel:"
echo "   # Instalar Vercel CLI (opcional):"
echo "   npm i -g vercel"
echo "   # Deploy:"
echo "   vercel"
echo ""
echo "✨ ¡Proyecto listo para desarrollo!"
