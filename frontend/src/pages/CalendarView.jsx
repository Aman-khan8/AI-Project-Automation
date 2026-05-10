import { useState, useMemo } from 'react'

// ─── Mock task data ───────────────────────────────────────────────────────────
const BASE_YEAR = 2026
const BASE_MONTH = 4 // May (0-indexed)

const MOCK_TASKS = [
  { id: 1,  name: 'Q4 Financial Report',       date: '2026-05-08', priority: 'High',   status: 'in-progress' },
  { id: 2,  name: 'Auth Module PR Review',      date: '2026-05-08', priority: 'High',   status: 'pending' },
  { id: 3,  name: 'Team Standup',               date: '2026-05-09', priority: 'Medium', status: 'pending' },
  { id: 4,  name: 'Update Documentation',       date: '2026-05-12', priority: 'Medium', status: 'pending' },
  { id: 5,  name: 'Design Onboarding Flow',     date: '2026-05-13', priority: 'High',   status: 'pending' },
  { id: 6,  name: 'Optimize DB Queries',        date: '2026-05-14', priority: 'Low',    status: 'in-progress' },
  { id: 7,  name: 'Client Demo Prep',           date: '2026-05-15', priority: 'High',   status: 'pending' },
  { id: 8,  name: 'Write Unit Tests',           date: '2026-05-16', priority: 'Medium', status: 'completed' },
  { id: 9,  name: 'CI/CD Pipeline Setup',       date: '2026-05-19', priority: 'Low',    status: 'completed' },
  { id: 10, name: 'Sprint Planning Meeting',    date: '2026-05-20', priority: 'Medium', status: 'pending' },
  { id: 11, name: 'Security Audit Review',      date: '2026-05-21', priority: 'High',   status: 'pending' },
  { id: 12, name: 'Performance Benchmarking',   date: '2026-05-22', priority: 'Medium', status: 'pending' },
  { id: 13, name: 'Stakeholder Presentation',   date: '2026-05-26', priority: 'High',   status: 'pending' },
  { id: 14, name: 'Code Review Session',        date: '2026-05-27', priority: 'Low',    status: 'pending' },
  { id: 15, name: 'Monthly Retrospective',      date: '2026-05-28', priority: 'Medium', status: 'pending' },
  { id: 16, name: 'Deploy to Production',       date: '2026-05-29', priority: 'High',   status: 'pending' },
  { id: 17, name: 'Team Lunch',                 date: '2026-05-30', priority: 'Low',    status: 'pending' },
  // June tasks
  { id: 18, name: 'Q2 Planning Session',        date: '2026-06-02', priority: 'High',   status: 'pending' },
  { id: 19, name: 'New Feature Kickoff',        date: '2026-06-03', priority: 'Medium', status: 'pending' },
  { id: 20, name: 'Infrastructure Review',      date: '2026-06-05', priority: 'Low',    status: 'pending' },
]

// ─── Colour maps ──────────────────────────────────────────────────────────────
const PRIORITY_DOT = {
  High:   'bg-red-500',
  Medium: 'bg-yellow-400',
  Low:    'bg-green-500',
}
const PRIORITY_PILL = {
  High:   'bg-red-500/20 text-red-400 border border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Low:    'bg-green-500/20 text-green-400 border border-green-500/30',
}
const PRIORITY_CARD = {
  High:   'border-l-red-500 bg-red-500/5 hover:bg-red-500/10',
  Medium: 'border-l-yellow-400 bg-yellow-500/5 hover:bg-yellow-500/10',
  Low:    'border-l-green-500 bg-green-500/5 hover:bg-green-500/10',
}
const STATUS_PILL = {
  pending:     'bg-slate-500/20 text-slate-400',
  'in-progress': 'bg-blue-500/20 text-blue-400',
  completed:   'bg-green-500/20 text-green-400',
}
const STATUS_LABEL = {
  pending:     '⏳ Pending',
  'in-progress': '🔄 In Progress',
  completed:   '✅ Done',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-1 animate-pulse">
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="h-20 sm:h-24 bg-slate-800/40 rounded-xl" style={{ animationDelay: `${i * 20}ms` }} />
      ))}
    </div>
  )
}

// ─── Animated empty state for day panel ──────────────────────────────────────
function DayEmptyState({ date }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
      <div className="text-5xl mb-4 animate-float">📭</div>
      <p className="text-slate-400 font-medium">No tasks on this day</p>
      <p className="text-slate-600 text-sm mt-1">
        {date ? `${MONTHS[date.getMonth()]} ${date.getDate()}` : ''} is free!
      </p>
    </div>
  )
}

// ─── Week row for weekly view ─────────────────────────────────────────────────
function WeekView({ weekDays, tasksByDate, today, selectedDate, onSelectDate }) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((day) => {
        const key = day.toISOString().split('T')[0]
        const dayTasks = tasksByDate[key] || []
        const isToday = day.toDateString() === today.toDateString()
        const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()

        return (
          <button
            key={key}
            onClick={() => onSelectDate(day)}
            className={`rounded-2xl p-3 text-left transition-all duration-200 border min-h-[120px] flex flex-col ${
              isSelected
                ? 'border-indigo-500/60 bg-indigo-500/10'
                : isToday
                ? 'border-indigo-500/30 bg-indigo-500/5'
                : 'border-slate-700/40 bg-slate-800/30 hover:border-slate-600/60 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">{DAYS[day.getDay()]}</span>
              <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${
                isToday ? 'bg-indigo-600 text-white' : 'text-slate-300'
              }`}>
                {day.getDate()}
              </span>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              {dayTasks.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className={`text-xs px-2 py-1 rounded-lg border-l-2 truncate ${PRIORITY_CARD[t.priority]}`}
                >
                  {t.name}
                </div>
              ))}
              {dayTasks.length > 3 && (
                <span className="text-xs text-slate-500 mt-auto">+{dayTasks.length - 3} more</span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ─── Monthly calendar grid ────────────────────────────────────────────────────
function MonthView({ calDays, tasksByDate, today, selectedDate, onSelectDate, currentMonth, currentYear }) {
  return (
    <>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-slate-500 uppercase py-2">{d}</div>
        ))}
      </div>
      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {calDays.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="h-20 sm:h-24" />
          const key = day.toISOString().split('T')[0]
          const dayTasks = tasksByDate[key] || []
          const isToday = day.toDateString() === today.toDateString()
          const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
          const isCurrentMonth = day.getMonth() === currentMonth && day.getFullYear() === currentYear

          return (
            <button
              key={key}
              onClick={() => onSelectDate(day)}
              className={`h-20 sm:h-24 rounded-xl p-1.5 text-left flex flex-col transition-all duration-200 border ${
                isSelected
                  ? 'border-indigo-500/60 bg-indigo-500/10'
                  : isToday
                  ? 'border-indigo-500/30 bg-indigo-500/5'
                  : isCurrentMonth
                  ? 'border-slate-700/30 bg-slate-800/30 hover:border-slate-600/50 hover:bg-slate-800/50'
                  : 'border-transparent bg-slate-900/20 opacity-40'
              }`}
            >
              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mb-1 ${
                isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}>
                {day.getDate()}
              </span>
              <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                {dayTasks.slice(0, 2).map((t) => (
                  <div
                    key={t.id}
                    className={`text-xs px-1.5 py-0.5 rounded border-l-2 truncate hidden sm:block ${PRIORITY_CARD[t.priority]}`}
                  >
                    {t.name}
                  </div>
                ))}
                {/* Mobile: just dots */}
                <div className="flex gap-0.5 sm:hidden flex-wrap">
                  {dayTasks.slice(0, 4).map((t) => (
                    <span key={t.id} className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[t.priority]}`} />
                  ))}
                </div>
                {dayTasks.length > 2 && (
                  <span className="text-xs text-slate-600 hidden sm:block">+{dayTasks.length - 2}</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}

// ─── Side panel: selected day tasks ──────────────────────────────────────────
function DayPanel({ date, tasks, loading }) {
  if (!date) return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center animate-fade-in">
      <div className="text-5xl mb-4 animate-float">👆</div>
      <p className="text-slate-400 font-medium">Select a day</p>
      <p className="text-slate-600 text-sm mt-1">Click any date to see its tasks</p>
    </div>
  )

  const label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold">{label}</h3>
          <p className="text-slate-500 text-xs mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        {tasks.length > 0 && (
          <div className="flex gap-1">
            {['High', 'Medium', 'Low'].map((p) => {
              const count = tasks.filter((t) => t.priority === p).length
              return count > 0 ? (
                <span key={p} className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_PILL[p]}`}>
                  {count} {p}
                </span>
              ) : null
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-800/40 rounded-xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <DayEmptyState date={date} />
      ) : (
        <div className="space-y-2">
          {tasks.map((task, i) => (
            <div
              key={task.id}
              className={`border-l-4 rounded-xl px-4 py-3 transition-all duration-200 animate-fade-in-up ${PRIORITY_CARD[task.priority]}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-white text-sm font-semibold leading-snug">{task.name}</p>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${PRIORITY_PILL[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_PILL[task.status]}`}>
                  {STATUS_LABEL[task.status]}
                </span>
                <span className="text-xs text-slate-600">📅 {task.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
      {[['High', 'bg-red-500'], ['Medium', 'bg-yellow-400'], ['Low', 'bg-green-500']].map(([label, dot]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
          {label} Priority
        </span>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
function CalendarView() {
  const today = useMemo(() => new Date(), [])
  const [viewMode, setViewMode] = useState('month') // 'month' | 'week'
  const [currentYear, setCurrentYear] = useState(BASE_YEAR)
  const [currentMonth, setCurrentMonth] = useState(BASE_MONTH)
  const [selectedDate, setSelectedDate] = useState(today)
  const [panelLoading, setPanelLoading] = useState(false)
  const [calLoading, setCalLoading] = useState(false)

  // Group tasks by date string
  const tasksByDate = useMemo(() => {
    const map = {}
    MOCK_TASKS.forEach((t) => {
      if (!map[t.date]) map[t.date] = []
      map[t.date].push(t)
    })
    return map
  }, [])

  // Calendar days for month view (with leading nulls)
  const calDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const days = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(currentYear, currentMonth, d))
    return days
  }, [currentYear, currentMonth])

  // Week days for week view (Mon–Sun of selected date's week)
  const weekDays = useMemo(() => {
    const base = selectedDate || today
    const day = base.getDay() // 0=Sun
    const monday = new Date(base)
    monday.setDate(base.getDate() - day) // start from Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d
    })
  }, [selectedDate, today])

  const selectedKey = selectedDate ? selectedDate.toISOString().split('T')[0] : null
  const selectedTasks = selectedKey ? (tasksByDate[selectedKey] || []) : []

  // Simulate skeleton on date select
  const handleSelectDate = (date) => {
    setPanelLoading(true)
    setSelectedDate(date)
    setTimeout(() => setPanelLoading(false), 400)
  }

  // Simulate skeleton on month navigate
  const navigate = (dir) => {
    setCalLoading(true)
    setTimeout(() => {
      let m = currentMonth + dir
      let y = currentYear
      if (m < 0) { m = 11; y-- }
      if (m > 11) { m = 0; y++ }
      setCurrentMonth(m)
      setCurrentYear(y)
      setCalLoading(false)
    }, 300)
  }

  const goToToday = () => {
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    handleSelectDate(today)
  }

  // Stats
  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`
  const monthTasks = MOCK_TASKS.filter((t) => t.date.startsWith(monthKey))
  const highCount = monthTasks.filter((t) => t.priority === 'High').length
  const completedCount = monthTasks.filter((t) => t.status === 'completed').length

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Calendar</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {monthTasks.length} tasks in {MONTHS[currentMonth]} · {highCount} high priority
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* View toggle */}
            <div className="flex bg-slate-800/60 border border-slate-700/50 rounded-xl p-1 gap-1">
              {['month', 'week'].map((v) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                    viewMode === v ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {v === 'month' ? '📅 Month' : '📆 Week'}
                </button>
              ))}
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-300 text-sm font-medium rounded-xl transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Tasks', value: monthTasks.length, color: 'text-white' },
            { label: 'High Priority', value: highCount, color: 'text-red-400' },
            { label: 'Completed', value: completedCount, color: 'text-green-400' },
            { label: 'Remaining', value: monthTasks.length - completedCount, color: 'text-yellow-400' },
          ].map((s) => (
            <div key={s.label} className="bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3">
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Calendar panel */}
          <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                ‹
              </button>
              <h2 className="text-white font-bold text-lg">
                {viewMode === 'week'
                  ? `Week of ${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : `${MONTHS[currentMonth]} ${currentYear}`}
              </h2>
              <button
                onClick={() => navigate(1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                ›
              </button>
            </div>

            {calLoading ? (
              <CalendarSkeleton />
            ) : viewMode === 'month' ? (
              <MonthView
                calDays={calDays}
                tasksByDate={tasksByDate}
                today={today}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                currentMonth={currentMonth}
                currentYear={currentYear}
              />
            ) : (
              <>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-slate-500 uppercase py-1">{d}</div>
                  ))}
                </div>
                <WeekView
                  weekDays={weekDays}
                  tasksByDate={tasksByDate}
                  today={today}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                />
              </>
            )}

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-slate-700/30">
              <Legend />
            </div>
          </div>

          {/* Day detail panel */}
          <div className="lg:w-80 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-5 overflow-y-auto max-h-[600px] lg:max-h-none">
            <DayPanel date={selectedDate} tasks={selectedTasks} loading={panelLoading} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default CalendarView
