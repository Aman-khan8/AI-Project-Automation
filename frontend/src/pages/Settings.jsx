import { useState } from 'react'

// ─── Initial state ────────────────────────────────────────────────────────────
const INITIAL = {
  // Profile
  name: 'Alex Johnson',
  email: 'alex@taskai.io',
  role: 'Product Manager',
  avatar: 'AJ',

  // Notifications
  notif: {
    emailDigest: true,
    taskReminders: true,
    aiSuggestions: true,
    weeklyReport: false,
    slackIntegration: false,
    browserPush: true,
  },

  // Working hours
  workStart: '09:00',
  workEnd: '18:00',
  workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],

  // Timezone
  timezone: 'America/New_York',

  // Theme
  theme: 'dark',
  accentColor: 'indigo',

  // AI preferences
  aiVerbosity: 'balanced',
  autoSchedule: true,
  smartPriority: true,
  dailySummary: true,
}

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
]

const ACCENT_COLORS = [
  { id: 'indigo',  label: 'Indigo',  cls: 'bg-indigo-500' },
  { id: 'violet',  label: 'Violet',  cls: 'bg-violet-500' },
  { id: 'cyan',    label: 'Cyan',    cls: 'bg-cyan-500' },
  { id: 'emerald', label: 'Emerald', cls: 'bg-emerald-500' },
  { id: 'rose',    label: 'Rose',    cls: 'bg-rose-500' },
  { id: 'amber',   label: 'Amber',   cls: 'bg-amber-500' },
]

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ─── Reusable components ──────────────────────────────────────────────────────

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden animate-fade-in-up">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700/40 bg-slate-800/30">
        <span className="text-xl">{icon}</span>
        <div>
          <h2 className="text-white font-bold text-sm">{title}</h2>
          {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-slate-200 text-sm font-medium">{label}</p>
        {description && <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          checked ? 'bg-indigo-600' : 'bg-slate-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
    />
  )
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
    >
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>
          {o.label ?? o}
        </option>
      ))}
    </select>
  )
}

// ─── Toast notification ───────────────────────────────────────────────────────
function Toast({ show }) {
  if (!show) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
      <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/40 backdrop-blur-md text-green-300 text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl">
        <span className="text-base">✅</span> Settings saved successfully
      </div>
    </div>
  )
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'profile',       icon: '👤', label: 'Profile' },
  { id: 'notifications', icon: '🔔', label: 'Notifications' },
  { id: 'schedule',      icon: '🕐', label: 'Working Hours' },
  { id: 'theme',         icon: '🎨', label: 'Appearance' },
  { id: 'ai',            icon: '🤖', label: 'AI Preferences' },
  { id: 'danger',        icon: '⚠️',  label: 'Danger Zone' },
]

// ─── Main component ───────────────────────────────────────────────────────────
export default function Settings() {
  const [prefs, setPrefs] = useState(INITIAL)
  const [activeSection, setActiveSection] = useState('profile')
  const [toast, setToast] = useState(false)
  const [saving, setSaving] = useState(false)

  const set = (key, val) => setPrefs((p) => ({ ...p, [key]: val }))
  const setNotif = (key, val) =>
    setPrefs((p) => ({ ...p, notif: { ...p.notif, [key]: val } }))

  const toggleWorkDay = (day) => {
    const days = prefs.workDays.includes(day)
      ? prefs.workDays.filter((d) => d !== day)
      : [...prefs.workDays, day]
    set('workDays', days)
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setToast(true)
      setTimeout(() => setToast(false), 3000)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account, preferences, and AI behaviour</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Sidebar ── */}
          <aside className="lg:w-52 shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible scrollbar-none pb-1 lg:pb-0">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                    activeSection === s.id
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* ── Content ── */}
          <div className="flex-1 space-y-5 min-w-0">

            {/* PROFILE */}
            {activeSection === 'profile' && (
              <SectionCard icon="👤" title="Profile" subtitle="Your personal information">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-2xl font-bold text-indigo-300">
                    {prefs.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{prefs.name}</p>
                    <p className="text-slate-500 text-sm">{prefs.email}</p>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 transition-colors">
                      Change avatar →
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <Input value={prefs.name} onChange={(v) => set('name', v)} placeholder="Your name" />
                  </Field>
                  <Field label="Email">
                    <Input type="email" value={prefs.email} onChange={(v) => set('email', v)} placeholder="you@example.com" />
                  </Field>
                  <Field label="Role / Title">
                    <Input value={prefs.role} onChange={(v) => set('role', v)} placeholder="e.g. Product Manager" />
                  </Field>
                  <Field label="Timezone">
                    <Select
                      value={prefs.timezone}
                      onChange={(v) => set('timezone', v)}
                      options={TIMEZONES.map((tz) => ({ value: tz, label: tz.replace('_', ' ') }))}
                    />
                  </Field>
                </div>
              </SectionCard>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === 'notifications' && (
              <SectionCard icon="🔔" title="Notifications" subtitle="Choose what you want to be notified about">
                <Toggle
                  checked={prefs.notif.taskReminders}
                  onChange={(v) => setNotif('taskReminders', v)}
                  label="Task Reminders"
                  description="Get notified 15 minutes before a task is due"
                />
                <div className="border-t border-slate-700/40" />
                <Toggle
                  checked={prefs.notif.emailDigest}
                  onChange={(v) => setNotif('emailDigest', v)}
                  label="Daily Email Digest"
                  description="Receive a morning summary of today's tasks"
                />
                <div className="border-t border-slate-700/40" />
                <Toggle
                  checked={prefs.notif.aiSuggestions}
                  onChange={(v) => setNotif('aiSuggestions', v)}
                  label="AI Suggestions"
                  description="Let AI proactively suggest task optimisations"
                />
                <div className="border-t border-slate-700/40" />
                <Toggle
                  checked={prefs.notif.weeklyReport}
                  onChange={(v) => setNotif('weeklyReport', v)}
                  label="Weekly Productivity Report"
                  description="Receive a detailed report every Friday at 5pm"
                />
                <div className="border-t border-slate-700/40" />
                <Toggle
                  checked={prefs.notif.browserPush}
                  onChange={(v) => setNotif('browserPush', v)}
                  label="Browser Push Notifications"
                  description="Show desktop notifications even when the tab is in background"
                />
                <div className="border-t border-slate-700/40" />
                <Toggle
                  checked={prefs.notif.slackIntegration}
                  onChange={(v) => setNotif('slackIntegration', v)}
                  label="Slack Integration"
                  description="Send task updates to your connected Slack workspace"
                />
              </SectionCard>
            )}

            {/* WORKING HOURS */}
            {activeSection === 'schedule' && (
              <SectionCard icon="🕐" title="Working Hours" subtitle="Define when you're available for tasks and meetings">
                {/* Work days */}
                <Field label="Working Days">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {WEEK_DAYS.map((day) => {
                      const active = prefs.workDays.includes(day)
                      return (
                        <button
                          key={day}
                          onClick={() => toggleWorkDay(day)}
                          className={`w-12 h-10 rounded-xl text-sm font-semibold transition-all duration-150 border ${
                            active
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                              : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-white'
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </Field>

                {/* Time range */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Start Time">
                    <input
                      type="time"
                      value={prefs.workStart}
                      onChange={(e) => set('workStart', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all [color-scheme:dark]"
                    />
                  </Field>
                  <Field label="End Time">
                    <input
                      type="time"
                      value={prefs.workEnd}
                      onChange={(e) => set('workEnd', e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all [color-scheme:dark]"
                    />
                  </Field>
                </div>

                {/* Visual summary */}
                <div className="bg-slate-900/40 border border-slate-700/40 rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-2xl">🗓️</span>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {prefs.workDays.join(', ')}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {prefs.workStart} – {prefs.workEnd} · {prefs.timezone.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* APPEARANCE */}
            {activeSection === 'theme' && (
              <SectionCard icon="🎨" title="Appearance" subtitle="Customise how TaskAI looks">
                {/* Theme */}
                <Field label="Theme">
                  <div className="grid grid-cols-3 gap-3 mt-1">
                    {[
                      { id: 'dark',   icon: '🌙', label: 'Dark' },
                      { id: 'light',  icon: '☀️',  label: 'Light' },
                      { id: 'system', icon: '💻', label: 'System' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => set('theme', t.id)}
                        className={`flex flex-col items-center gap-2 py-4 rounded-xl border text-sm font-medium transition-all duration-150 ${
                          prefs.theme === t.id
                            ? 'border-indigo-500/60 bg-indigo-500/10 text-indigo-300'
                            : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600 hover:text-white'
                        }`}
                      >
                        <span className="text-2xl">{t.icon}</span>
                        {t.label}
                        {prefs.theme === t.id && (
                          <span className="text-xs bg-indigo-600/30 text-indigo-400 px-2 py-0.5 rounded-full">Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Accent colour */}
                <Field label="Accent Color">
                  <div className="flex flex-wrap gap-3 mt-1">
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => set('accentColor', c.id)}
                        title={c.label}
                        className={`w-9 h-9 rounded-xl ${c.cls} transition-all duration-150 ${
                          prefs.accentColor === c.id
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-500 text-xs mt-2">
                    Selected: <span className="text-slate-300 capitalize">{prefs.accentColor}</span>
                  </p>
                </Field>

                {/* Preview card */}
                <div className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-4">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Preview</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-lg">⚡</div>
                    <div>
                      <p className="text-white text-sm font-bold">TaskAI Dashboard</p>
                      <p className="text-slate-400 text-xs">Your theme looks great</p>
                    </div>
                    <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded-full">
                      {prefs.theme} mode
                    </span>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* AI PREFERENCES */}
            {activeSection === 'ai' && (
              <SectionCard icon="🤖" title="AI Preferences" subtitle="Control how the AI assistant behaves">
                <Toggle
                  checked={prefs.autoSchedule}
                  onChange={(v) => set('autoSchedule', v)}
                  label="Auto-Schedule Tasks"
                  description="AI automatically finds the best time slot for new tasks based on your calendar"
                />
                <div className="border-t border-slate-700/40" />
                <Toggle
                  checked={prefs.smartPriority}
                  onChange={(v) => set('smartPriority', v)}
                  label="Smart Priority Suggestions"
                  description="AI re-ranks your task list based on deadlines, dependencies, and impact"
                />
                <div className="border-t border-slate-700/40" />
                <Toggle
                  checked={prefs.dailySummary}
                  onChange={(v) => set('dailySummary', v)}
                  label="Daily AI Summary"
                  description="Generate a personalised morning briefing every day at your work start time"
                />
                <div className="border-t border-slate-700/40" />

                <Field label="AI Response Style">
                  <div className="grid grid-cols-3 gap-3 mt-1">
                    {[
                      { id: 'concise',   icon: '⚡', label: 'Concise', desc: 'Short & direct' },
                      { id: 'balanced',  icon: '⚖️',  label: 'Balanced', desc: 'Default' },
                      { id: 'detailed',  icon: '📝', label: 'Detailed', desc: 'Full context' },
                    ].map((v) => (
                      <button
                        key={v.id}
                        onClick={() => set('aiVerbosity', v.id)}
                        className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-sm transition-all duration-150 ${
                          prefs.aiVerbosity === v.id
                            ? 'border-indigo-500/60 bg-indigo-500/10 text-indigo-300'
                            : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600 hover:text-white'
                        }`}
                      >
                        <span className="text-xl">{v.icon}</span>
                        <span className="font-semibold">{v.label}</span>
                        <span className="text-xs opacity-60">{v.desc}</span>
                      </button>
                    ))}
                  </div>
                </Field>
              </SectionCard>
            )}

            {/* DANGER ZONE */}
            {activeSection === 'danger' && (
              <SectionCard icon="⚠️" title="Danger Zone" subtitle="Irreversible actions — proceed with caution">
                <div className="space-y-4">
                  {[
                    {
                      title: 'Clear All Tasks',
                      desc: 'Permanently delete all tasks and task history. This cannot be undone.',
                      btn: 'Clear Tasks',
                      color: 'border-orange-500/30 bg-orange-500/5',
                      btnColor: 'bg-orange-600/20 hover:bg-orange-600/30 border-orange-500/40 text-orange-400',
                    },
                    {
                      title: 'Reset AI Memory',
                      desc: 'Wipe all learned preferences and patterns. AI will start fresh.',
                      btn: 'Reset AI',
                      color: 'border-yellow-500/30 bg-yellow-500/5',
                      btnColor: 'bg-yellow-600/20 hover:bg-yellow-600/30 border-yellow-500/40 text-yellow-400',
                    },
                    {
                      title: 'Delete Account',
                      desc: 'Permanently delete your account and all associated data.',
                      btn: 'Delete Account',
                      color: 'border-red-500/30 bg-red-500/5',
                      btnColor: 'bg-red-600/20 hover:bg-red-600/30 border-red-500/40 text-red-400',
                    },
                  ].map((item) => (
                    <div key={item.title} className={`border rounded-xl px-5 py-4 flex items-center justify-between gap-4 ${item.color}`}>
                      <div>
                        <p className="text-white text-sm font-semibold">{item.title}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <button className={`shrink-0 px-4 py-2 border rounded-xl text-xs font-semibold transition-colors ${item.btnColor}`}>
                        {item.btn}
                      </button>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Save button — not shown on danger zone */}
            {activeSection !== 'danger' && (
              <div className="flex justify-end animate-fade-in">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/20 text-sm"
                >
                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    '💾 Save Changes'
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      <Toast show={toast} />
    </div>
  )
}
