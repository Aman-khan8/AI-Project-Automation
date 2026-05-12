import ROLES from "./rolesConfig";
import SelectCard from "./SelectCard";

export default function Step2Role({ data, onChange, onNext, onBack, TOTAL_STEPS }) {
  const valid = !!data.role;
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <p className="text-indigo-400 text-sm font-semibold mb-2">Step 2 of {TOTAL_STEPS - 1}</p>
        <h2 className="text-2xl font-bold text-white mb-2">What's your role?</h2>
        <p className="text-slate-400 text-sm">This helps AI tailor task suggestions to your work context.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {ROLES.map((r, i) => (
          <button
            key={r.id}
            onClick={() => onChange('role', r.id)}
            style={{ animationDelay: `${i * 40}ms` }}
            className={`flex flex-col items-center gap-2 py-4 rounded-xl border text-sm font-semibold transition-all duration-200 animate-fade-in-up ${
              data.role === r.id
                ? 'border-indigo-500/60 bg-indigo-500/10 text-indigo-300 shadow-lg shadow-indigo-500/10'
                : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600 hover:text-white'
            }`}
          >
            <span className="text-2xl">{r.icon}</span>
            {r.label}
            {data.role === r.id && <span className="text-xs text-indigo-400">✓ Selected</span>}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="px-5 py-3 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-300 font-semibold rounded-xl transition-colors text-sm">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!valid}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
