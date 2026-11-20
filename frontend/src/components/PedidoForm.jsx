import { useState } from 'react';
import { crearPedido } from '../services/pedidosService';

export default function PedidoForm({ onPedidoCreado }) {
  const [formData, setFormData] = useState({
    cliente: '',
    direccion: '',
    localidad: '',
    producto: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [errorForm, setErrorForm] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErrorForm(null);

    try {
      await crearPedido(formData);
      setFormData({
        cliente: '',
        direccion: '',
        localidad: '',
        producto: '',
      });
      onPedidoCreado();
    } catch (err) {
      setErrorForm(err.message);
    } finally {
      setEnviando(false);
    }
  };

  // Input claro con borde marcado y texto negro/pizarra oscuro
  const inputStyles =
    'w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorForm && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {errorForm}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Cliente
        </label>
        <input
          type="text"
          name="cliente"
          value={formData.cliente}
          onChange={handleChange}
          placeholder="Ej. María González"
          required
          className={inputStyles}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Dirección de Destino
        </label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Ej. Av. Tapia de Cruz 450"
          required
          className={inputStyles}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Localidad
        </label>
        <input
          type="text"
          name="localidad"
          value={formData.localidad}
          onChange={handleChange}
          placeholder="Ej. Belén de Escobar"
          required
          className={inputStyles}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Producto / Carga
        </label>
        <input
          type="text"
          name="producto"
          value={formData.producto}
          onChange={handleChange}
          placeholder="Ej. Caja Repuestos Industriales"
          required
          className={inputStyles}
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
      >
        {enviando ? 'Geolocalizando y creando...' : 'Registrar Despacho'}
      </button>
    </form>
  );
}