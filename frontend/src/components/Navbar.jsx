import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ totalPedidos, conectado = true }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">

        {/* Lado izquierdo: Logo + Nombre */}
        <div className="flex items-center gap-3 min-w-0">
          <img src="/logo.svg" alt="LogiTrack Logo" className="w-9 h-9 shrink-0" />
          <div className="hidden min-[400px]:block min-w-0">
            <h1 className="m-0 text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
              LogiTrack
            </h1>
            <span className="block mt-1 text-xs leading-none text-slate-500 dark:text-slate-400 font-medium">
              {t('subtitle')}
            </span>
          </div>
        </div>

        {/* Lado derecho: Indicador de estado y contador */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            aria-label={t('toggleLang')}
            className="shrink-0 px-2.5 py-2 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <button
            onClick={toggleTheme}
            aria-label={t('toggleTheme')}
            className="shrink-0 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div
            className={`hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${conectado
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950 dark:border-emerald-800'
              : 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950 dark:border-red-800'
              }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${conectado ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}
            ></span>
            {conectado ? t('apiConnected') : t('apiDisconnected')}
          </div>

          <div className="whitespace-nowrap text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">
            {t('ordersCount')}: <span className="font-bold text-slate-900 dark:text-white">{totalPedidos}</span>
          </div>
        </div>

      </div>
    </header>
  );
}