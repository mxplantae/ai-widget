# Mxplantae AI Widget

Backend en Vercel (API) + scripts frontend en `public/`.

## Variables de entorno
- `OPENAI_API_KEY` (Production)

## Dominios
- Scripts: servir desde `https://www.mxplantae.com/`
- APIs: `https://<proyecto>.vercel.app` o `https://ai.mxplantae.com` (cuando el CNAME esté "Valid").

## BigCommerce (Script Manager)
1) Config (inline, en **Head**):
```html
<script>
  window.MXP_WIDGET_API_BASE = "https://<proyecto>.vercel.app";
</script>
