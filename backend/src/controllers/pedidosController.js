import { db } from "../config/db.js";
import { buscarLocalidad } from "../services/georefService.js";
import { obtenerClimaActual } from "../services/weatherService.js";

export async function crearPedido(req, res) {
  const { cliente, direccion, localidad, producto } = req.body;

  if (!cliente || !direccion || !localidad || !producto) {
    return res.status(400).json({
      error:
        "Falta algun campo obligatorio: cliente, direccion, localidad, producto.",
    });
  }

  try {
    // 1. Obtener coordenadas geográficas con GeoRef
    const datosUbicacion = await buscarLocalidad(localidad);

    if (!datosUbicacion) {
      return res.status(404).json({
        error: `No se encontró la localidad "${localidad}" en GeoRef.`,
      });
    }

    const { lat, lon } = datosUbicacion;

    // 2. Obtener el clima actual con Open-Meteo
    const clima = await obtenerClimaActual(lat, lon);

    // 3. Guardar el registro en PostgreSQL (Neon)
    const query = `
      INSERT INTO pedidos (cliente_nombre, direccion_destino, localidad, provincia, producto, latitud, longitud, temperatura_clima, velocidad_viento)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [
      cliente,
      direccion,
      datosUbicacion.localidad,
      datosUbicacion.provincia,
      producto,
      lat,
      lon,
      clima.temperatura,
      clima.velocidad_viento,
    ];

    const resultado = await db.query(query, values);

    // 4. Responder al cliente
    return res.status(201).json({
      message: "Pedido creado exitosamente con geolocalización y clima.",
      pedido: resultado.rows[0],
      clima_actual: clima,
    });
  } catch (error) {
    console.error("Error al procesar el pedido:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
