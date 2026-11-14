import axios from "axios";
/**
 * Consulta la API pública de GeoRef AR para buscar una localidad y sus coordenadas geográficas.
 * @param {string} nombreLocalidad - Nombre de la localidad a buscar (ej: "Escobar", "Campana").
 * @returns {Promise<Object|null>} - Retorna los datos normalizados de ubicación o null si no se encuentra.
 */
export async function buscarLocalidad(nombreLocalidad) {
  try {
    const url = `https://apis.datos.gob.ar/georef/api/localidades?nombre=${encodeURIComponent(nombreLocalidad)}&max=1`;

    const response = await axios.get(url);

    const data = response.data;

    if (data.localidades && data.localidades.length > 0) {
      const loc = data.localidades[0];
      return {
        localidad: loc.nombre,
        provincia: loc.provincia.nombre,
        lat: loc.centroide.lat,
        lon: loc.centroide.lon,
      };
    }

    return null;
  } catch (error) {
    console.error("Error consultando GeoRef:", error.message);
    throw error;
  }
}
