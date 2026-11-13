import { db } from '../config/db.js';
import { obtenerCoordenadas, obtenerClima } from '../services/externalService.js';

export async function crearPedido(req, res) {
  const { cliente, direccion, localidad, producto } = req.body;

  if (!cliente || !direccion || !localidad || !producto) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: cliente, direccion, localidad, producto.' });
  }

  try {
    // 1. Obtener coordenadas geográficas con GeoRef
    const { lat, lon } = await obtenerCoordenadas(direccion, localidad);

    // 2. Obtener el clima actual con Open-Meteo
    const clima = await obtenerClima(lat, lon);

    // 3. Guardar el registro en PostgreSQL (Neon)
    const query = `
      INSERT INTO pedidos (cliente, direccion, localidad, producto, latitud, longitud, temperatura_actual)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [cliente, direccion, localidad, producto, lat, lon, clima.temperature];
    
    const resultado = await db.query(query, values);

    // 4. Responder al cliente
    return res.status(201).json({
      message: 'Pedido creado exitosamente con geolocalización y clima.',
      pedido: resultado.rows[0],
      clima_actual: clima
    });

  } catch (error) {
    console.error('Error al procesar el pedido:', error.message);
    return res.status(500).json({ error: error.message });
  }
}