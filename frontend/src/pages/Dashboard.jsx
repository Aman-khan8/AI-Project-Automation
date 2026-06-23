import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

const API_BASE = import.meta.env.VITE_API_URL

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
  const isLogin = useSelector((state) => state.login.login)
  const [recentTasks, setRecentTasks] = useState([])

  const normalizeTask = (task) => ({
    id: task._id || task.id,
    title: task.title || task.name || '',
    description: task.description || '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
    priority: task.Priority || task.priority || 'Medium',
    taskStatus: task.taskStatus || task.status || 'pending',
  })

  const todayKey = new Date().toISOString().slice(0, 10)
  const weekEndKey = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const dueTodayCount = recentTasks.filter((t) => t.dueDate === todayKey).length
  const pendingCount = recentTasks.filter((t) => t.taskStatus === 'pending').length
  const completedTodayCount = recentTasks.filter((t) => t.taskStatus === 'completed' && t.dueDate === todayKey).length
  const upcomingCount = recentTasks.filter((t) => {
    if (!t.dueDate) return false
    return t.dueDate >= todayKey && t.dueDate <= weekEndKey
  }).length
  const overdueCount = recentTasks.filter((t) => t.dueDate && t.dueDate < todayKey && t.taskStatus !== 'completed').length
  const highPriorityCount = recentTasks.filter((t) => t.priority === 'High').length
  const topTask =
    recentTasks.find((t) => t.taskStatus === 'pending' && t.priority === 'High') ||
    recentTasks.find((t) => t.taskStatus === 'pending') ||
    recentTasks[0]
  const aiSuggestionsCount = isLogin ? Math.max(0, Math.min(10, Math.ceil((pendingCount + highPriorityCount) / 3))) : 0
  const productivityLabel = pendingCount <= 3 ? 'High' : pendingCount <= 7 ? 'Medium' : 'Low'
  const focusScore = Math.max(50, 100 - pendingCount * 4 - overdueCount * 5)
  const summaryText = isLogin
    ? recentTasks.length === 0
      ? 'You have no tasks yet. Add a task to see your live summary and priorities.'
      : `You have ${pendingCount} pending task${pendingCount !== 1 ? 's' : ''}, ${dueTodayCount} due today, and ${overdueCount} overdue task${overdueCount !== 1 ? 's' : ''}. ${topTask ? `Next focus: “${topTask.title}”${topTask.dueDate ? ` due ${topTask.dueDate}` : ''}.` : ''}`
    : 'Log in to view your live task summary.'

  const overviewCards = [
    {
      label: 'Pending Tasks',
      value: pendingCount,
      icon: '⏰',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      iconBg: 'bg-orange-500/20',
      textColor: 'text-orange-500',
      valueColor: 'text-orange-300',
    },
    {
      label: 'Completed Today',
      value: completedTodayCount,
      icon: '✅',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      iconBg: 'bg-green-500/20',
      textColor: 'text-green-400',
      valueColor: 'text-green-300',
    },
    {
      label: 'Due This Week',
      value: upcomingCount,
      icon: '📅',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      valueColor: 'text-blue-300',
    },
    {
      label: 'High Priority',
      value: highPriorityCount,
      icon: '🔥',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      iconBg: 'bg-red-500/20',
      textColor: 'text-red-400',
      valueColor: 'text-red-300',
    },
  ]

  useEffect(() => {
    const fetchTasks = async () => {
      if (!isLogin) {
        setRecentTasks([])
        return
      }

      try {
        const res = await axios.get(`${API_BASE}/tasks/fetchTasks`, {
          withCredentials: true,
        })

        if (res.data?.statuscode === 200) {
          const payload = res.data?.data || []
          setRecentTasks(payload.map(normalizeTask))
        } else {
          setRecentTasks([])
          console.error('Failed to fetch tasks:', res.data?.message)
        }
      } catch (err) {
        setRecentTasks([])
        console.error('Error fetching tasks:', err)
      }
    }

    fetchTasks()
  }, [isLogin])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-slate-950 px-2 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">Good morning, Alex 👋</h1>
          <p className="text-slate-400 mt-0.5 text-xs">{today}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          {overviewCards.map((card) => (
            <div
              key={card.label}
              className={`${card.bg} border ${card.border} rounded-xl p-3 card-hover`}
            >
              <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center text-lg mb-2`}>
                {card.icon}
              </div>
              <div className={`text-2xl font-extrabold ${card.valueColor} mb-0.5`}>{card.value}</div>
              <div className={`text-xs font-medium ${card.textColor}`}>{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 relative rounded-xl p-px bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-slate-900 rounded-xl p-4 h-full">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-lg">
                  🤖
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">AI Daily Summary</h2>
                  <p className="text-slate-500 text-xs">Generated just now</p>
                </div>
                <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  AI Powered
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {summaryText}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full">
                  📈 Productivity: {productivityLabel}
                </span>
                <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full">
                  🎯 Focus Score: {focusScore}
                </span>
                <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full">
                  ⚡ {aiSuggestionsCount} AI suggestions
                </span>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <h2 className="text-white font-bold mb-3 text-base">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/tasks')}
                className="w-full flex items-center gap-2 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-lg transition-colors text-xs font-medium"
              >
                <span>➕</span> Add New Task
              </button>
              <button
                onClick={() => navigate('/tasks')}
                className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 text-slate-300 rounded-lg transition-colors text-xs font-medium"
              >
                <span>📋</span> View All Tasks
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 text-slate-300 rounded-lg transition-colors text-xs font-medium"
              >
                <span>📊</span> Generate Report
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-lg transition-colors text-xs font-medium"
              >
                <span>✨</span> AI Suggestions
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-base">Recent Tasks</h2>
            <button
              onClick={() => navigate('/tasks')}
              className="text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="space-y-0.5">
            <div className="grid grid-cols-12 gap-2 px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-6">Task</div>
              <div className="col-span-2 text-center">Priority</div>
              <div className="col-span-4 text-right">Status</div>
            </div>
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="grid grid-cols-12 gap-2 items-center px-2 py-2 rounded-lg hover:bg-slate-700/30 transition-colors"
                >
                  <div className="col-span-6 text-xs text-slate-200 font-medium truncate">
                    {task.title}
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`text-xs font-semibold ${priorityBadge[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="col-span-4 flex justify-end">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge[task.taskStatus]}`}>
                      {statusLabel[task.taskStatus]}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-2 py-4 text-sm text-slate-400">Recent tasks will appear here once you log in.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
