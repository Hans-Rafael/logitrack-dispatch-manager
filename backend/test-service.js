import { buscarLocalidad } from './src/services/georefService.js';
import { obtenerClimaActual } from './src/services/weatherService.js';

async function probarIntegracionServicios() {
  try {
    const ubicacion = await buscarLocalidad('Escobar');
    console.log('1. Ubicación obtenida:', ubicacion);

    if (ubicacion) {
      const clima = await obtenerClimaActual(ubicacion.lat, ubicacion.lon);
      console.log('2. Clima en destino:', clima);
    }
  } catch (error) {
    console.error('Error en la integración:', error.message);
  }
}

probarIntegracionServicios();