import { db } from "../config/db.js";
import { buscarLocalidad } from "../services/georefService.js";
import { obtenerClimaActual } from "../services/weatherService.js";

// POST /api/pedidos
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
// GET /api/pedidos - Listar todos los pedidos
export async function obtenerPedidos(req, res) {
  const { id } = req.params;
  try {
    const query = `
      SELECT id, cliente_nombre, direccion_destino, localidad, provincia, 
             latitud, longitud, temperatura_clima, velocidad_viento, 
             estado, created_at, producto 
      FROM pedidos 
      ORDER BY created_at DESC;
    `;
    const resultado = await db.query(query, [id]);

    if (resultado.rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Pedido con ID ${id} no encontrado.` });
    }

    return res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al obtener el pedido:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
// GET /api/pedidos/:id - Obtener un pedido por ID específico
export async function obtenerPedidoPorId(req, res) {
  const { id } = req.params;
  try {
    const query = `
      SELECT id, cliente_nombre, direccion_destino, localidad, provincia, 
             latitud, longitud, temperatura_clima, velocidad_viento, 
             estado, created_at, producto 
      FROM pedidos 
      WHERE id = $1;
    `;
    const resultado = await db.query(query, [id]);

    if (resultado.rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Pedido con ID ${id} no encontrado.` });
    }

    return res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al obtener el pedido:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
// PATCHi/pedidos/:id - Actualizar estado del pedido
export async function actualizarPedido(req, res) {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) {
    return res
      .status(400)
      .json({ error: 'Se requiere el campo "estado" para actualizar.' });
  }

  try {
    const query = `
      UPDATE pedidos 
      SET estado = $1 
      WHERE id = $2 
      RETURNING id, cliente_nombre, direccion_destino, localidad, provincia, 
                latitud, longitud, temperatura_clima, velocidad_viento, 
                estado, created_at, producto;
    `;
    const resultado = await db.query(query, [estado, id]);

    if (resultado.rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Pedido con ID ${id} no encontrado para actualizar.` });
    }

    return res.status(200).json({
      message: "Pedido actualizado exitosamente",
      pedido: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar pedido:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

// DELETE /api/pedidos/:id - Eliminar un pedido
export async function eliminarPedido(req, res) {
  const { id } = req.params;
  try {
    const query = `
      DELETE FROM pedidos 
      WHERE id = $1 
      RETURNING id, cliente_nombre, direccion_destino, localidad, provincia, 
                latitud, longitud, temperatura_clima, velocidad_viento, 
                estado, created_at, producto;
    `;
    const resultado = await db.query(query, [id]);

    if (resultado.rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Pedido con ID ${id} no encontrado para eliminar.` });
    }

    return res.status(200).json({
      message: "Pedido eliminado exitosamente",
      pedido: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar pedido:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
