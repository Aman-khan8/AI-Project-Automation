import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Step config ──────────────────────────────────────────────────────────────
const TOTAL_STEPS = 4

const ROLES = [
  { id: 'developer',  icon: '💻', label: 'Developer' },
  { id: 'designer',   icon: '🎨', label: 'Designer' },
  { id: 'manager',    icon: '📊', label: 'Manager' },
  { id: 'marketer',   icon: '📣', label: 'Marketer' },
  { id: 'founder',    icon: '🚀', label: 'Founder' },
  { id: 'student',    icon: '🎓', label: 'Student' },
  { id: 'freelancer', icon: '🌐', label: 'Freelancer' },
  { id: 'other',      icon: '✨', label: 'Other' },
]

const GOALS = [
  { id: 'focus',      icon: '🎯', label: 'Stay focused',         desc: 'Reduce distractions and deep-work more' },
  { id: 'deadlines',  icon: '⏰', label: 'Hit deadlines',         desc: 'Never miss a due date again' },
  { id: 'automate',   icon: '⚡', label: 'Automate repetitive tasks', desc: 'Let AI handle the routine stuff' },
  { id: 'team',       icon: '👥', label: 'Collaborate better',   desc: 'Coordinate tasks across your team' },
  { id: 'balance',    icon: '⚖️',  label: 'Work-life balance',    desc: 'Protect personal time and avoid burnout' },
  { id: 'insights',   icon: '📈', label: 'Track progress',       desc: 'Understand where your time actually goes' },
]

const WORK_STYLES = [
  { id: 'timeblocks', icon: '🗓️', label: 'Time Blocks',    desc: 'Schedule focused blocks for each task' },
  { id: 'priority',   icon: '🔥', label: 'Priority First', desc: 'Always tackle the most important task first' },
  { id: 'inbox',      icon: '📥', label: 'Inbox Zero',     desc: 'Process everything as it comes in' },
  { id: 'flexible',   icon: '🌊', label: 'Flexible Flow',  desc: 'Work when inspiration strikes' },
]

// ─── Reusable pieces ──────────────────────────────────────────────────────────

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i < current
              ? 'bg-indigo-500 w-8'
              : i === current
              ? 'bg-indigo-400 w-8 animate-pulse'
              : 'bg-slate-700 w-4'
          }`}
        />
      ))}
    </div>
  )
}

function SelectCard({ selected, onClick, icon, label, desc }) {
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

// ─── Individual steps ─────────────────────────────────────────────────────────

function Step0Welcome({ onNext }) {
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

function Step1Name({ data, onChange, onNext, onBack }) {
  const valid = data.name.trim().length >= 2

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <p className="text-indigo-400 text-sm font-semibold mb-2">Step 1 of {TOTAL_STEPS - 1}</p>
        <h2 className="text-2xl font-bold text-white mb-2">What's your name?</h2>
        <p className="text-slate-400 text-sm">We'll use this to personalise your dashboard and AI greetings.</p>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Alex Johnson"
            autoFocus
            className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Work Email <span className="text-slate-600">(optional)</span></label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="you@company.com"
            className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>
         <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
          <input
            type="password"
            value={data.password}
            onChange={(e) => onChange('password', e.target.value)}
            placeholder="*********"
            autoFocus
            className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>

<div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
          <input
            type="password"
            value={data.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            placeholder="*********"
            autoFocus
            className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>
        
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
  )
}

function Step2Role({ data, onChange, onNext, onBack }) {
  const valid = !!data.role

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
  )
}

function Step3Goals({ data, onChange, onNext, onBack }) {
  const toggleGoal = (id) => {
    const goals = data.goals.includes(id)
      ? data.goals.filter((g) => g !== id)
      : [...data.goals, id]
    onChange('goals', goals)
  }

  const valid = data.goals.length >= 1

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
  )
}

function Step4WorkStyle({ data, onChange, onNext, onBack }) {
  const valid = !!data.workStyle

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
  )
}

// ─── Completion screen ────────────────────────────────────────────────────────
function StepComplete({ data, onGoToDashboard }) {
  const roleLabel = ROLES.find((r) => r.id === data.role)?.label ?? data.role
  const goalLabels = data.goals.map((g) => GOALS.find((x) => x.id === g)?.label).filter(Boolean)
  const styleLabel = WORK_STYLES.find((s) => s.id === data.workStyle)?.label ?? data.workStyle

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
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    name: '',
    email: '',
    role: '',
    goals: [],
    workStyle: '',
  })

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }))
  const next = () => setStep((s) => s + 1)
  const back = () => setStep((s) => s - 1)
 const  onGoToDashboard=async() => {
  try{
  const sendData=await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, data);
  if(sendData.status===201){
    console.log("Setup data sent successfully");
      navigate('/dashboard')
  }
  else{
    console.error("Failed to send setup data");
  }
}catch(err){
  console.error("Error sending setup data:", err);
}}

  const isComplete = step === TOTAL_STEPS

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        {/* Progress bar + skip */}
        {step > 0 && !isComplete && (
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <StepIndicator current={step} total={TOTAL_STEPS} />
            <button
              onClick={() => navigate('/dashboard')}
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              Skip setup
            </button>
          </div>
        )}

        {/* Card */}
        <div className={`bg-slate-900/60 border border-slate-700/50 rounded-3xl p-8 sm:p-10 shadow-2xl ${
          step === 0 || isComplete ? 'text-center' : ''
        }`}>
          {step === 0 && <Step0Welcome onNext={next} />}
          {step === 1 && <Step1Name data={data} onChange={set} onNext={next} onBack={back} />}
          {step === 2 && <Step2Role data={data} onChange={set} onNext={next} onBack={back} />}
          {step === 3 && <Step3Goals data={data} onChange={set} onNext={next} onBack={back} />}
          {step === 4 && !isComplete && <Step4WorkStyle data={data} onChange={set} onNext={next} onBack={back} />}
          {isComplete && <StepComplete data={data} onGoToDashboard={onGoToDashboard} />}
        </div>

        {/* Step counter */}
        {step > 0 && !isComplete && (
          <p className="text-center text-slate-600 text-xs mt-4 animate-fade-in">
            Step {step} of {TOTAL_STEPS - 1}
          </p>
        )}

      </div>
    </div>
  )
}
