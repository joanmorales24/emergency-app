# ⚡ INICIO RÁPIDO - 5 PASOS

## 🎯 Tu app está 100% lista. Aquí está lo que debes hacer:

### PASO 1️⃣: Ejecutar SQL en Supabase (2 minutos)

1. **Login en Supabase**: https://supabase.com
2. **Abre tu proyecto**
3. **SQL Editor** → New Query
4. **Copia TODO de `supabase.sql`** (el archivo que está en esta carpeta)
5. **Pega y ejecuta** (botón verde)

✅ **Listo.** Ya tienes las tablas creadas.

---

### PASO 2️⃣: Crear repositorio en GitHub (2 minutos)

1. **Accede a GitHub**: https://github.com
2. **Nuevo repositorio** → Name: `emergency-app`
3. **Create Repository**
4. **Sigue las instrucciones** para hacer push:

```bash
git init
git add .
git commit -m "Initial: Emergency app"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/emergency-app.git
git push -u origin main
```

✅ **Listo.** Tu código está en GitHub.

---

### PASO 3️⃣: Deploy en Vercel (1 minuto)

1. **Accede a Vercel**: https://vercel.com
2. **Login con GitHub**
3. **Add New** → **Project**
4. **Selecciona** `emergency-app` repository
5. **Vercel auto-detecta Next.js** ✅
6. **Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
   ```
   (Ya están en `.env.local`)
7. **Deploy**

⏳ **Espera 2-3 minutos...**

✅ **¡TU APP ESTÁ LIVE!** 🚀

---

### PASO 4️⃣: Compartir el Link

Vercel te da:
```
https://emergency-app.vercel.app
```

**Comparte en**:
- WhatsApp grupos
- Redes sociales
- Organizaciones
- Amigos familiares

---

### PASO 5️⃣: Monitorear (Opcional)

**Ver reportes en tiempo real:**
1. Supabase → Table Editor → reports
2. Verás cada reporte que se cree

**Ver estadísticas:**
1. Vercel → Deployments
2. Observa tráfico y errores

---

## 🔍 Qué hace tu app

✅ Reportar personas desaparecidas  
✅ Mapa interactivo en tiempo real  
✅ Buscar por cédula automáticamente  
✅ Contacto por teléfono/email/WhatsApp  
✅ 100% privado (cédulas hasheadas)  
✅ Sin login requerido  
✅ Geolocalización automática + manual  

---

## 📝 Estructura de carpetas

```
emergency-app/
├── app/                    # Página principal + APIs
│   ├── api/               # Backend (Next.js API routes)
│   ├── layout.tsx         # Layout HTML
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── MapView.tsx       # Mapa
│   └── ReportForm.tsx    # Formulario
├── lib/                   # Utilidades
│   ├── supabase.ts       # Cliente Supabase
│   └── hash.ts           # Hash de cédulas
├── types/                # Tipos TypeScript
├── supabase.sql          # BD schema
├── package.json          # Dependencias
├── DEPLOY.md             # Guía detallada
└── QUICK_START.md        # Este archivo
```

---

## ⚠️ IMPORTANTE

- **`.env.local` tiene tus credenciales** → No lo subas a GitHub público
- **`vercel.json` configura automáticamente Vercel**
- **`supabase.sql` crea las tablas necesarias**

---

## 🆘 Si algo falla

1. **Verifica SQL en Supabase**: ¿Las tablas se crearon?
2. **Verifica Vercel logs**: Deployments → Logs
3. **Verifica variables de entorno**: Settings → Environment Variables
4. **Comprueba que cédula hash esté bien**: Look en `.env.local`

---

## 🚀 Siguiente Paso

**¡Ahora solo debes hacer los PASOS 1-5!**

Una vez esté listo, comparte el link de Vercel con todos.

**¡Gracias por ayudar a las personas! ❤️**
