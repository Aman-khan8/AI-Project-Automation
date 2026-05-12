import GOALS from "./goalsConfig";
import SelectCard from "./SelectCard";

export default function Step3Goals({ data, onChange, onNext, onBack, TOTAL_STEPS }) {
  const toggleGoal = (id) => {
    const goals = data.goals.includes(id)
      ? data.goals.filter((g) => g !== id)
      : [...data.goals, id];
    onChange('goals', goals);
  };
  const valid = data.goals.length >= 1;
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <p className="text-indigo-400 text-sm font-semibold mb-2">Step 3 of {TOTAL_STEPS - 1}</p>
        <h2 className="text-2xl font-bold text-white mb-2">What are your productivity goals?</h2>
        <p className="text-slate-400 text-sm">Pick one or more — AI will optimise around these.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 mb-8">
        {GOALS.map((g, i) => (
          <div key={g.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-in-up">
            <SelectCard
              selected={data.goals.includes(g.id)}
              onClick={() => toggleGoal(g.id)}
              icon={g.icon}
              label={g.label}
              desc={g.desc}
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
          Continue →
        </button>
      </div>
    </div>
  );
}
