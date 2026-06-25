# 🆘 App de Emergencia - Venezuela

Aplicación mobile-first para reportar personas desaparecidas y conectar con familiares.

## ✨ Características

- 📱 **100% Mobile-Friendly** - Interfaz optimizada para celulares
- 🗺️ **Mapa Interactivo** - Ve reportes en tiempo real
- 🔍 **Búsqueda por Cédula** - Encuentra coincidencias automáticas
- 🔒 **Privacidad Garantizada** - Cédulas hasheadas, datos encriptados
- 📞 **Múltiples Contactos** - Teléfono, Email, WhatsApp
- ⚡ **Totalmente Anónimo** - Sin login requerido
- 📍 **Ubicación Automática o Manual** - Elige la que prefieras

## 🚀 Stack Técnico

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Maps**: Leaflet
- **Hosting**: Vercel
- **Security**: SHA256 hashing de cédulas

## 📋 Instrucciones de Deploy

**Lee el archivo `DEPLOY.md` para pasos detallados** (5-10 minutos máximo)

Resumen rápido:
1. Ejecuta SQL en Supabase
2. Sube código a GitHub
3. Conecta GitHub a Vercel
4. ¡Listo! 🎉

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Visita http://localhost:3000
```

## 📊 Estructura de BD

### Tabla: reports
```sql
- id (UUID)
- cedula_hash (VARCHAR) - Protegida
- name (VARCHAR)
- age_approximate (INT)
- latitude, longitude (DECIMAL)
- contact_phone, contact_email, contact_whatsapp
- status (alive | missing | found)
- message (TEXT)
- created_at, updated_at
```

## 🔐 Seguridad

- ✅ Cédulas nunca se guardan en texto plano
- ✅ Row Level Security (RLS) en Supabase
- ✅ HTTPS en Vercel
- ✅ Datos anónimos sin tracking

## 📱 Responsive Design

- Mobile first
- Elementos grandes (toque fácil)
- Accesible para cualquier edad
- Compatible con Android e iOS

## 🙏 Propósito

Esta app es 100% para fines humanitarios, creada para ayudar a encontrar personas desaparecidas durante emergencias.

---

**¿Problemas?** Revisa `DEPLOY.md` o los logs en Vercel.
