export default function Step0Welcome({ onNext }) {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-5xl animate-float">
          ⚡
        </div>
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-xs">✓</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
        Welcome to <span className="gradient-text">TaskAI</span>
      </h1>
      <p className="text-slate-400 text-base max-w-sm mb-10 leading-relaxed">
        Let's take 60 seconds to personalise your experience. We'll set up your profile, goals, and AI preferences.
      </p>
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm mb-10">
        {[
          { icon: '🤖', label: 'AI-Powered' },
          { icon: '⚡', label: 'Instant Setup' },
          { icon: '🔒', label: 'Private & Secure' },
        ].map((f) => (
          <div key={f.label} className="bg-slate-800/40 border border-slate-700/40 rounded-xl py-3 px-2 text-center animate-fade-in-up">
            <div className="text-2xl mb-1">{f.icon}</div>
            <p className="text-slate-400 text-xs font-medium">{f.label}</p>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        className="px-10 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-xl shadow-indigo-500/30 text-base"
      >
        Let's Get Started →
      </button>
    </div>
  )
}
