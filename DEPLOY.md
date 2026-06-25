# 🆘 Guía de Deployar - App de Emergencia Venezuela

## Paso 1: Preparar Supabase

1. **Accede a Supabase**: https://supabase.com
2. **Abre tu proyecto**
3. **Vete a SQL Editor** (en el menú izquierdo)
4. **Haz clic en "New Query"**
5. **Copia y pega TODO el contenido de `supabase.sql`**
6. **Ejecuta la query** (botón verde "Run")

✅ Las tablas se han creado correctamente

## Paso 2: Preparar GitHub

1. **Crea un nuevo repositorio en GitHub** (puede ser público o privado)
2. **Clona el repositorio** en tu computadora
3. **Copia todos los archivos** de esta app al repositorio
4. **Haz commit y push**:
   ```bash
   git add .
   git commit -m "Initial commit: Emergency app"
   git push origin main
   ```

## Paso 3: Deployar en Vercel

1. **Accede a Vercel**: https://vercel.com
2. **Haz login con tu cuenta de GitHub**
3. **Haz clic en "Add New..." → "Project"**
4. **Selecciona tu repositorio de GitHub**
5. **Vercel autodetectará que es un proyecto Next.js** ✅
6. **En "Environment Variables", agrega**:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://hjtrytxjysfzoyrcheam.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = sb_publishable_CpsZ_2LyPf-e0WFMee_zRQ_D-SK0CBD
   ```
7. **Haz clic en "Deploy"**

⏳ Espera a que termine el deploy (2-3 minutos)

✅ **¡Tu app está LIVE!** 🎉

## Paso 4: Configurar el Dominio (Opcional)

Vercel te da un dominio gratis como:
```
https://emergency-app.vercel.app
```

Si quieres un dominio personalizado:
1. **En Vercel**, vete a Settings → Domains
2. **Agrega tu dominio**
3. **Sigue las instrucciones para apuntar el DNS**

## Paso 5: Compartir la App

Comparte el link de Vercel con:
- Redes sociales
- WhatsApp grupos
- Correos
- Organizaciones humanitarias

**Ejemplo de mensaje para compartir**:
```
🆘 APP DE EMERGENCIA - VENEZUELA
Reporta personas desaparecidas y busca a familiares
✅ Privacidad garantizada
📱 100% Mobile-friendly
🗺️ Mapa interactivo en tiempo real

Link: https://emergency-app.vercel.app
```

## Monitorear en Vivo

### Ver reportes en tiempo real:
1. **Accede a Supabase**
2. **Vete a Table Editor → reports**
3. **Verás cada reporte que se cree**

### Ver logs de la app:
1. **En Vercel**, vete a Deployments
2. **Haz clic en tu deployment**
3. **Vete a Logs**

## Actualizaciones Futuras

Si necesitas cambiar algo (colors, texto, funcionalidades):

1. **Edita los archivos en tu computadora**
2. **Haz commit y push a GitHub**:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push origin main
   ```
3. **Vercel automáticamente redeploy** en ~2 minutos

## Seguridad & Privacidad

✅ **Cédulas hasheadas** - No se guardan en texto plano
✅ **HTTPS** - Conexión encriptada
✅ **Datos anónimos** - No se pide login
✅ **RLS en Supabase** - Control de acceso

---

**¿Preguntas o problemas?**
- Revisa los logs en Vercel
- Verifica que las variables de entorno sean correctas
- Confirma que la SQL de Supabase se ejecutó sin errores

**¡Gracias por ayudar a encontrar a las personas! ❤️**
