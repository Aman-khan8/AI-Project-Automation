import { useState } from 'react';
import { Eye, EyeOff, Check, X } from "lucide-react";

export default function Step1Name({ data, onChange, onNext, onBack, TOTAL_STEPS }) {
  // --- Validation Logic ---
  const isGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(data.email);
  
  const passwordRules = {
    length: data.password.length >= 8,
    number: /[0-9]/.test(data.password),
    special: /[!.@#$%^&*]/.test(data.password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const passwordsMatch = data.password === data.confirmPassword && data.password !== "";
  
  const valid = data.name.trim().length >= 2 && isGmail && isPasswordValid && passwordsMatch;

  // --- UI State ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <p className="text-indigo-400 text-sm font-semibold mb-2">Step 1 of {TOTAL_STEPS - 1}</p>
        <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
        <p className="text-slate-400 text-sm">Please use your Gmail address and a strong password.</p>
      </div>

      <div className="space-y-4 mb-8">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Alex Johnson"
            autoFocus
            className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>

        {/* Work Email (Gmail Restricted) */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Gmail Address</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="you@gmail.com"
            className={`w-full bg-slate-800/60 border ${data.email && !isGmail ? 'border-red-500/50' : 'border-slate-600/50'} rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
          />
          {data.email && !isGmail && (
            <p className="text-red-400 text-xs mt-1">Please enter a valid @gmail.com address.</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => onChange('password', e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          
          {/* Password Requirements Checklist */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <RuleItem label="8+ characters" met={passwordRules.length} />
            <RuleItem label="Contains number" met={passwordRules.number} />
            <RuleItem label="Special symbol" met={passwordRules.special} />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={data.confirmPassword}
              onChange={(e) => onChange('confirmPassword', e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-slate-800/60 border ${data.confirmPassword && !passwordsMatch ? 'border-red-500/50' : 'border-slate-600/50'} rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {data.confirmPassword && !passwordsMatch && (
            <p className="text-red-400 text-xs mt-1">Passwords do not match.</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="px-5 py-3 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-300 font-semibold rounded-xl transition-colors text-sm">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!valid}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// Small helper component for password rules
function RuleItem({ label, met }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${met ? 'text-emerald-400' : 'text-slate-500'}`}>
      {met ? <Check size={12} /> : <X size={12} />}
      {label}
    </div>
  );
}