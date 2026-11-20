const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 0. Health check del backend (GET /api/health). Devuelve true/false, nunca lanza.
export async function verificarSalud() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// 1. Obtener todos los pedidos (GET)
export async function obtenerPedidos() {
  const response = await fetch(`${API_URL}/pedidos`);
  if (!response.ok) {
    throw new Error('Error al obtener la lista de pedidos');
  }
  return await response.json(); // Devuelve { total, pedidos }
}

// 2. Obtener un pedido por ID (GET /:id)
export async function obtenerPedidoPorId(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}`);
  if (!response.ok) {
    throw new Error(`No se pudo encontrar el pedido #${id}`);
  }
  return await response.json();
}

// 3. Crear un nuevo pedido (POST)
export async function crearPedido(datosPedido) {
  const response = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosPedido),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al crear el pedido');
  }
  return data;
}

// 4. Actualizar estado del pedido (PATCH /:id)
export async function actualizarEstadoPedido(id, nuevoEstado) {
  const response = await fetch(`${API_URL}/pedidos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ estado: nuevoEstado }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al actualizar el estado');
  }
  return data;
}

// 5. Eliminar un pedido (DELETE /:id)
export async function eliminarPedido(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al eliminar el pedido');
  }
  return data;
}