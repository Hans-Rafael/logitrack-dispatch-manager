import { useLanguage } from '../context/LanguageContext';
import { actualizarEstadoPedido, eliminarPedido } from '../services/pedidosService';

const ESTADOS_ESTILOS = {
  pendiente: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  en_camino: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  entregado: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  cancelado: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
};

const normalizar = (estado) => estado?.trim().toLowerCase().replace(/\s+/g, '_');

const ETIQUETAS = {
  pendiente: 'filterPending',
  en_camino: 'filterInTransit',
  entregado: 'filterDelivered',
  cancelado: 'filterCancelled',
};

export default function PedidoList({ pedidos, onActualizar }) {
  const { t } = useLanguage();
  const handleCambioEstado = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      onActualizar();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm(`${t('confirmDelete')} #${id}?`)) return;
    try {
      await eliminarPedido(id);
      onActualizar();
    } catch (err) {
      alert(err.message);
    }
  };

  if (pedidos.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{t('emptyTitle')}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {t('emptySubtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pedidos.map((pedido) => {
        const badgeStyle =
          ESTADOS_ESTILOS[normalizar(pedido.estado)] || 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

        return (
          <article
            key={pedido.id}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:border-emerald-400 hover:shadow-lg transition-all duration-200"
          >
            {/* Fila superior: Cliente, Producto y Badge de Estado */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">#{pedido.id}</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {pedido.cliente_nombre || pedido.cliente}
                  </h3>
                </div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">
                  📦 {pedido.producto}
                </p>
              </div>

              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${badgeStyle}`}
              >
                {ETIQUETAS[normalizar(pedido.estado)] ? t(ETIQUETAS[normalizar(pedido.estado)]) : pedido.estado?.replace('_', ' ')}
              </span>
            </div>

            {/* Fila intermedia: Ubicación (GeoRef) y Clima (Open-Meteo) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700 mb-4">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-100 block mb-0.5">📍 {t('destination')}:</span>
                {pedido.direccion_destino || pedido.direccion}, {pedido.localidad}
                {pedido.latitud && pedido.longitud && (
                  <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    GPS: {Number(pedido.latitud).toFixed(4)}, {Number(pedido.longitud).toFixed(4)}
                  </span>
                )}
              </div>

              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-100 block mb-0.5">🌤️ {t('routeWeather')}:</span>
                {pedido.temperatura_clima !== null && pedido.temperatura_clima !== undefined ? (
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {pedido.temperatura_clima}°C
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">{t('noWeather')}</span>
                )}
              </div>
            </div>

            {/* Fila inferior: Controles PATCH (estado) y DELETE */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('statusLabel')}:</label>
                <select
                  value={normalizar(pedido.estado)}
                  onChange={(e) => handleCambioEstado(pedido.id, e.target.value)}
                  className="text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="pendiente">{t('filterPending')}</option>
                  <option value="en_camino">{t('filterInTransit')}</option>
                  <option value="entregado">{t('filterDelivered')}</option>
                  <option value="cancelado">{t('filterCancelled')}</option>
                </select>
              </div>

              <button
                onClick={() => handleEliminar(pedido.id)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {t('deleteBtn')}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}