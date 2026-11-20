import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import PedidoForm from './components/PedidoForm';
import { obtenerPedidos } from './services/pedidosService';

export default function App() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Barra superior */}
      <Navbar totalPedidos={pedidos.length} />

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
            
            {cargando ? (
              <p className="text-sm text-slate-500 animate-pulse">
                Cargando pedidos desde la base de datos...
              </p>
            ) : (
              <p className="text-sm font-medium text-emerald-700">
                Conexión exitosa: {pedidos.length} pedidos cargados en memoria.
              </p>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}