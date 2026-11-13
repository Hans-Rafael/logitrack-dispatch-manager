import axios from 'axios';

/**
 * Consulta la API de GeoRef para obtener latitud y longitud según dirección y localidad.
 */
export async function obtenerCoordenadas(direccion, localidad) {
  try {
    const response = await axios.get('https://apis.datos.gob.ar/georef/api/direcciones', {
      params: {
        direccion: direccion,
        localidad: localidad,
        max: 1
      }
    });

    const direcs = response.data.direcciones;
    if (!direcs || direcs.length === 0) {
      throw new Error('No se encontraron coordenadas para la dirección especificada en GeoRef.');
    }

    const { lat, lon } = direcs[0].ubicacion;
    return { lat, lon };
  } catch (error) {
    throw new Error(`Error al consultar GeoRef: ${error.message}`);
  }
}

/**
 * Consulta la API de Open-Meteo para obtener el clima actual según las coordenadas.
 */
export async function obtenerClima(lat, lon) {
  try {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true
      }
    });

    return response.data.current_weather;
  } catch (error) {
    throw new Error(`Error al consultar Open-Meteo: ${error.message}`);
  }
}