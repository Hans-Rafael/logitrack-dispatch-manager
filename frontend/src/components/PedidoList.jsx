import { actualizarEstadoPedido, eliminarPedido } from '../services/pedidosService';

const ESTADOS_ESTILOS = {
  pendiente: 'bg-amber-100 text-amber-700 border-amber-300',
  en_camino: 'bg-blue-100 text-blue-700 border-blue-300',
  entregado: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  cancelado: 'bg-red-100 text-red-700 border-red-300',
};

const normalizar = (estado) => estado?.trim().toLowerCase().replace(/\s+/g, '_');

export default function PedidoList({ pedidos, onActualizar }) {
  const handleCambioEstado = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      onActualizar();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm(`¿Seguro que deseas eliminar el pedido #${id}?`)) return;
    try {
      await eliminarPedido(id);
      onActualizar();
    } catch (err) {
      alert(err.message);
    }
  };

  if (pedidos.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
        <p className="text-sm font-medium text-slate-600">No hay envíos para mostrar.</p>
        <p className="text-xs text-slate-400 mt-1">
          Registra un nuevo despacho o ajusta los filtros de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pedidos.map((pedido) => {
        const badgeStyle =
          ESTADOS_ESTILOS[normalizar(pedido.estado)] || 'bg-slate-100 text-slate-700 border-slate-200';

        return (
          <article
            key={pedido.id}
            className="p-5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-white hover:border-emerald-400 hover:shadow-lg transition-all duration-200"
          >
            {/* Fila superior: Cliente, Producto y Badge de Estado */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">#{pedido.id}</span>
                  <h3 className="text-base font-bold text-slate-900">
                    {pedido.cliente_nombre || pedido.cliente}
                  </h3>
                </div>
                <p className="text-sm font-medium text-emerald-700 mt-0.5">
                  📦 {pedido.producto}
                </p>
              </div>

              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${badgeStyle}`}
              >
                {pedido.estado?.replace('_', ' ')}
              </span>
            </div>

            {/* Fila intermedia: Ubicación (GeoRef) y Clima (Open-Meteo) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200/80 mb-4">
              <div>
                <span className="font-semibold text-slate-800 block mb-0.5">📍 Destino:</span>
                {pedido.direccion_destino || pedido.direccion}, {pedido.localidad}
                {pedido.latitud && pedido.longitud && (
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    GPS: {Number(pedido.latitud).toFixed(4)}, {Number(pedido.longitud).toFixed(4)}
                  </span>
                )}
              </div>

              <div>
                <span className="font-semibold text-slate-800 block mb-0.5">🌤️ Clima en ruta:</span>
                {pedido.temperatura_clima !== null && pedido.temperatura_clima !== undefined ? (
                  <span className="text-sm font-bold text-slate-800">
                    {pedido.temperatura_clima}°C
                  </span>
                ) : (
                  <span className="text-slate-400">Sin datos meteorológicos</span>
                )}
              </div>
            </div>

            {/* Fila inferior: Controles PATCH (estado) y DELETE */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500">Estado:</label>
                <select
                  value={normalizar(pedido.estado)}
                  onChange={(e) => handleCambioEstado(pedido.id, e.target.value)}
                  className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_camino">En camino</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <button
                onClick={() => handleEliminar(pedido.id)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}