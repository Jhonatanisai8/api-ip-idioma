const express = require('express');
const geoip = require('geoip-lite');
const app = express();

// Lista de códigos de países de habla hispana (ISO 3166-1 alpha-2)
const spanishSpeakingCountries = [
  'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'ES', 'GQ',
  'GT', 'HN', 'MX', 'NI', 'PA', 'PE', 'PY', 'SV', 'UY', 'VE'
];

app.get('/detectar-idioma', (req, res) => {
  // 1. Obtener la IP del cliente
  // Nota: En desarrollo local '::1' o '127.0.0.1' no darán ubicación.
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Limpiar IP en caso de que venga con formato IPv6
  if (ip.includes('::ffff:')) {
    ip = ip.split(':').reverse()[0];
  }

  // 2. Buscar la ubicación por IP
  const geo = geoip.lookup("8.8.8.8");
  let idioma = 'ENGLISH'; // Idioma por defecto

  if (geo && geo.country) {
    if (spanishSpeakingCountries.includes(geo.country)) {
      idioma = 'SPANISH';
    }
  }

  // 3. Retornar el resultado
  res.json({
    ip: ip,
    pais: geo ? geo.country : 'Desconocido',
    idioma_detectado: idioma
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});