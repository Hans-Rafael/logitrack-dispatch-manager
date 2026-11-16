export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-800/50 rounded-full mb-3">
          Sistema Activo
        </span>
        <h1 className="text-2xl font-bold text-white mb-2">
          LogiTrack Dispatch Manager
        </h1>
        <p className="text-slate-400 text-sm">
          Frontend inicializado con React, Vite y Tailwind CSS. Listo para conectar con la API.
        </p>
      </div>
    </div>
  )
}