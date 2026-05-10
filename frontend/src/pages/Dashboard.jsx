import { useNavigate } from 'react-router-dom'

const overviewCards = [
  {
    label: 'Pending Tasks',
    value: 12,
    icon: '⏰',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    iconBg: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    valueColor: 'text-orange-300',
  },
  {
    label: 'Completed Today',
    value: 8,
    icon: '✅',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    iconBg: 'bg-green-500/20',
    textColor: 'text-green-400',
    valueColor: 'text-green-300',
  },
  {
    label: 'Upcoming Events',
    value: 5,
    icon: '📅',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    valueColor: 'text-blue-300',
  },
  {
    label: 'AI Suggestions',
    value: 3,
    icon: '✨',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    valueColor: 'text-purple-300',
  },
]

const recentTasks = [
  { id: 1, name: 'Prepare Q4 financial report', status: 'completed', priority: 'High' },
  { id: 2, name: 'Review pull requests for auth module', status: 'in-progress', priority: 'High' },
  { id: 3, name: 'Update team documentation', status: 'pending', priority: 'Medium' },
  { id: 4, name: 'Schedule 1:1 meetings with team', status: 'completed', priority: 'Medium' },
  { id: 5, name: 'Optimize database queries', status: 'in-progress', priority: 'Low' },
]

const statusBadge = {
  completed: 'bg-green-500/20 text-green-400 border border-green-500/30',
  'in-progress': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  pending: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
}

const statusLabel = {
  completed: '✅ Completed',
  'in-progress': '🔄 In Progress',
  pending: '⏳ Pending',
}

const priorityBadge = {
  High: 'text-red-400',
  Medium: 'text-yellow-400',
  Low: 'text-green-400',
}

function Dashboard() {
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Good morning, Alex 👋</h1>
          <p className="text-slate-400 mt-1">{today}</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {overviewCards.map((card) => (
            <div
              key={card.label}
              className={`${card.bg} border ${card.border} rounded-2xl p-5 card-hover`}
            >
              <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center text-xl mb-4`}>
                {card.icon}
              </div>
              <div className={`text-3xl font-extrabold ${card.valueColor} mb-1`}>{card.value}</div>
              <div className={`text-sm font-medium ${card.textColor}`}>{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* AI Daily Summary */}
          <div className="lg:col-span-2 relative rounded-2xl p-px bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-slate-900 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <h2 className="text-white font-bold">AI Daily Summary</h2>
                  <p className="text-slate-500 text-xs">Generated just now</p>
                </div>
                <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  AI Powered
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm">
                You have a <span className="text-orange-400 font-semibold">productive day ahead</span>. 
                Your top priority is the Q4 financial report review — I've pre-loaded the latest data 
                for you. The auth module PR has been waiting 18 hours; I recommend addressing it before 
                your 2pm standup. Based on your patterns, your{' '}
                <span className="text-indigo-400 font-semibold">peak focus window</span> is 9–11am — 
                I've blocked that time for deep work. You're on track to complete{' '}
                <span className="text-green-400 font-semibold">87% of this week's goals</span>. 
                Three low-priority tasks can be safely deferred to next week without impact.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 rounded-full">
                  📈 Productivity: High
                </span>
                <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 rounded-full">
                  🎯 Focus Score: 92/100
                </span>
                <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 rounded-full">
                  ⚡ 3 automations running
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-white font-bold mb-5">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/tasks')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-xl transition-colors text-sm font-medium"
              >
                <span>➕</span> Add New Task
              </button>
              <button
                onClick={() => navigate('/tasks')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 text-slate-300 rounded-xl transition-colors text-sm font-medium"
              >
                <span>📋</span> View All Tasks
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 text-slate-300 rounded-xl transition-colors text-sm font-medium"
              >
                <span>📊</span> Generate Report
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-xl transition-colors text-sm font-medium"
              >
                <span>✨</span> AI Suggestions
              </button>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold text-lg">Recent Tasks</h2>
            <button
              onClick={() => navigate('/tasks')}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
            >
              View all →
            </button>
          </div>

          <div className="space-y-1">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-6">Task</div>
              <div className="col-span-2 text-center">Priority</div>
              <div className="col-span-4 text-right">Status</div>
            </div>

            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl hover:bg-slate-700/30 transition-colors"
              >
                <div className="col-span-6 text-sm text-slate-200 font-medium truncate">
                  {task.name}
                </div>
                <div className="col-span-2 text-center">
                  <span className={`text-xs font-semibold ${priorityBadge[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="col-span-4 flex justify-end">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge[task.status]}`}>
                    {statusLabel[task.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
