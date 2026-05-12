export default function SelectCard({ selected, onClick, icon, label, desc }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 w-full ${
        selected
          ? 'border-indigo-500/60 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
          : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/60 hover:bg-slate-800/50'
      }`}
    >
      <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className={`text-sm font-semibold ${selected ? 'text-indigo-300' : 'text-slate-200'}`}>{label}</p>
        {desc && <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      {selected && (
        <span className="ml-auto shrink-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>
      )}
    </button>
  )
}
