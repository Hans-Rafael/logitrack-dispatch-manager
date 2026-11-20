import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import PedidoForm from './components/PedidoForm';
import PedidoList from './components/PedidoList';
import { obtenerPedidos, verificarSalud } from './services/pedidosService';

const INTERVALO_HEALTH_MS = 30000;

export default function App() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [apiActiva, setApiActiva] = useState(true);
  const apiActivaRef = useRef(true);

  // "En Camino", "en camino" y "en_camino" se tratan como el mismo estado
  const normalizar = (estado) => estado?.trim().toLowerCase().replace(/\s+/g, '_');

  const pedidosFiltrados = pedidos.filter((p) => {
    const coincideEstado =
      filtroEstado === 'todos' || normalizar(p.estado) === filtroEstado;
    const texto = busqueda.trim().toLowerCase();
    const coincideTexto =
      !texto ||
      [p.cliente_nombre, p.producto, p.localidad, p.provincia, p.direccion_destino]
        .filter(Boolean)
        .some((campo) => campo.toLowerCase().includes(texto));
    return coincideEstado && coincideTexto;
  });

  const contarPorEstado = (estado) =>
    pedidos.filter((p) => normalizar(p.estado) === estado).length;

  const cargarPedidos = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await obtenerPedidos();
      setPedidos(data.pedidos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // Health check periódico: el badge del Navbar refleja si el backend responde
  useEffect(() => {
    let activo = true;

    const comprobar = async () => {
      const ok = await verificarSalud();
      if (!activo) return;
      const estabaCaida = !apiActivaRef.current;
      apiActivaRef.current = ok;
      setApiActiva(ok);
      // Si el backend volvió, recargar los pedidos y limpiar el error
      if (ok && estabaCaida) cargarPedidos();
    };

    comprobar();
    const id = setInterval(comprobar, INTERVALO_HEALTH_MS);
    return () => {
      activo = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Barra superior */}
      <Navbar totalPedidos={pedidos.length} conectado={apiActiva} />


      {/* Contenedor principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Alerta de error si el backend está apagado */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <strong>Error de conexión:</strong> {error}. Verifica que el servidor backend esté corriendo en el puerto 3000.
          </div>
        )}

        {/* Grilla principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda: Formulario */}
          <section className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Nuevo Despacho
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Se obtendrá geolocalización y clima automáticamente.
            </p>
            <PedidoForm onPedidoCreado={cargarPedidos} />
          </section>

          {/* Columna Derecha: Lista de Pedidos */}
          <section className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Envíos Activos
            </h2>

            {/* Buscador y filtros por estado */}
            <div className="mb-5 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por cliente, producto, dirección o localidad..."
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg pl-3 pr-9 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
                />
                {busqueda && (
                  <button
                    type="button"
                    onClick={() => setBusqueda('')}
                    aria-label="Borrar búsqueda"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { valor: 'todos', etiqueta: 'Todos' },
                  { valor: 'pendiente', etiqueta: 'Pendiente' },
                  { valor: 'en_camino', etiqueta: 'En camino' },
                  { valor: 'entregado', etiqueta: 'Entregado' },
                  { valor: 'cancelado', etiqueta: 'Cancelado' },
                ].map(({ valor, etiqueta }) => {
                  const activo = filtroEstado === valor;
                  const cantidad =
                    valor === 'todos' ? pedidos.length : contarPorEstado(valor);
                  return (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => setFiltroEstado(valor)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                        activo
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {etiqueta} ({cantidad})
                    </button>
                  );
                })}
                {(busqueda || filtroEstado !== 'todos') && (
                  <button
                    type="button"
                    onClick={() => {
                      setBusqueda('');
                      setFiltroEstado('todos');
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline px-2 py-1.5 cursor-pointer"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>

            {cargando ? (
              <p className="text-sm text-slate-500 animate-pulse">
                Cargando pedidos desde la base de datos...
              </p>
            ) : error ? (
              <p className="text-sm text-slate-400">No se pudieron cargar los pedidos.</p>
            ) : (
              <PedidoList pedidos={pedidosFiltrados}onActualizar={cargarPedidos} />
            )}
          </section>

        </div>
      </main>
    </div>
  );
}