import WORK_STYLES from "./workStylesConfig";
import SelectCard from "./SelectCard";

export default function Step4WorkStyle({ data, onChange, onNext, onBack, TOTAL_STEPS }) {
  const valid = !!data.workStyle;
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <p className="text-indigo-400 text-sm font-semibold mb-2">Step 4 of {TOTAL_STEPS - 1}</p>
        <h2 className="text-2xl font-bold text-white mb-2">How do you prefer to work?</h2>
        <p className="text-slate-400 text-sm">AI will schedule and suggest tasks that match your style.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {WORK_STYLES.map((s, i) => (
          <div key={s.id} style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-in-up">
            <SelectCard
              selected={data.workStyle === s.id}
              onClick={() => onChange('workStyle', s.id)}
              icon={s.icon}
              label={s.label}
              desc={s.desc}
            />
          </div>
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
          Finish Setup →
        </button>
      </div>
    </div>
  );
}
