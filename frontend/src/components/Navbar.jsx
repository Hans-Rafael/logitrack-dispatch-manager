export default function Navbar({ totalPedidos }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Lado izquierdo: Logo + Nombre */}
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="LogiTrack Logo" className="w-9 h-9" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
              LogiTrack
            </h1>
            <span className="text-xs text-slate-500 font-medium">
              Dispatch Manager
            </span>
          </div>
        </div>

        {/* Lado derecho: Indicador de estado y contador */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            API Conectada
          </div>
          
          <div className="text-sm text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
            Pedidos: <span className="font-bold text-slate-900">{totalPedidos}</span>
          </div>
        </div>

      </div>
    </header>
  );
}