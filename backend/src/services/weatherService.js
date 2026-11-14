import axios from "axios";
/**
 * Consulta la API pública de Open-Meteo usando Axios para obtener el clima actual según coordenadas.
 * @param {number} lat - Latitud geográfica.
 * @param {number} lon - Longitud geográfica.
 * @returns {Promise<Object>} - Retorna temperatura, velocidad del viento y código de clima.
 */
export async function obtenerClimaActual(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    const response = await axios.get(url);
    const data = response.data;

    if (data && data.current_weather) {
      return {
        temperatura: data.current_weather.temperature,
        velocidad_viento: data.current_weather.windspeed,
        codigo_clima: data.current_weather.weathercode,
      };
    }

    throw new Error(
      "La respuesta de Open-Meteo no contiene datos del clima actual.",
    );
  } catch (error) {
    console.error("Error consultando Open-Meteo:", error.message);
    throw error;
  }
}
