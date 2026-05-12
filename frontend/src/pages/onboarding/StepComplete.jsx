import ROLES from "./rolesConfig";
import GOALS from "./goalsConfig";
import WORK_STYLES from "./workStylesConfig";

export default function StepComplete({ data, onGoToDashboard }) {
  const roleLabel = ROLES.find((r) => r.id === data.role)?.label ?? data.role;
  const goalLabels = data.goals.map((g) => GOALS.find((x) => x.id === g)?.label).filter(Boolean);
  const styleLabel = WORK_STYLES.find((s) => s.id === data.workStyle)?.label ?? data.workStyle;
  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      {/* Confetti-like dots */}
      <div className="relative mb-8">
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-4', 'bottom-0 right-4', '-top-2 left-1/2'].map((pos, i) => (
          <span
            key={i}
            className={`absolute w-3 h-3 rounded-full animate-float ${
              ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-400', 'bg-green-400'][i]
            } ${pos}`}
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
        <div className="w-24 h-24 rounded-3xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-5xl">
          🎉
        </div>
      </div>
      <h2 className="text-3xl font-extrabold text-white mb-2">
        You're all set, <span className="gradient-text">{data.name.split(' ')[0]}!</span>
      </h2>
      <p className="text-slate-400 text-sm max-w-xs mb-8 leading-relaxed">
        TaskAI has been personalised for you. Here's a summary of your setup:
      </p>
      {/* Summary card */}
      <div className="w-full max-w-sm bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-left mb-8 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">👤</span>
          <div>
            <p className="text-slate-500 text-xs">Name</p>
            <p className="text-white text-sm font-semibold">{data.name}</p>
          </div>
        </div>
        <div className="border-t border-slate-700/40" />
        <div className="flex items-center gap-3">
          <span className="text-xl">{ROLES.find((r) => r.id === data.role)?.icon ?? '✨'}</span>
          <div>
            <p className="text-slate-500 text-xs">Role</p>
            <p className="text-white text-sm font-semibold">{roleLabel}</p>
          </div>
        </div>
        <div className="border-t border-slate-700/40" />
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">🎯</span>
          <div>
            <p className="text-slate-500 text-xs">Goals</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {goalLabels.map((g) => (
                <span key={g} className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700/40" />
        <div className="flex items-center gap-3">
          <span className="text-xl">{WORK_STYLES.find((s) => s.id === data.workStyle)?.icon ?? '🌊'}</span>
          <div>
            <p className="text-slate-500 text-xs">Work Style</p>
            <p className="text-white text-sm font-semibold">{styleLabel}</p>
          </div>
        </div>
      </div>
      <button
        onClick={onGoToDashboard}
        className="w-full max-w-sm py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-xl shadow-indigo-500/30 text-base"
      >
        Go to Dashboard →
      </button>
    </div>
  );
}
