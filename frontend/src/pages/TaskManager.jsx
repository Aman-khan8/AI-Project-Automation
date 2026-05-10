import { useState } from 'react'

const INITIAL_TASKS = [
  { id: 1, name: 'Prepare Q4 financial report', description: 'Compile all quarterly data and create executive summary slides.', priority: 'High', dueDate: '2024-02-15', status: 'in-progress' },
  { id: 2, name: 'Review pull requests for auth module', description: 'Review and merge pending PRs for the authentication refactor.', priority: 'High', dueDate: '2024-02-12', status: 'pending' },
  { id: 3, name: 'Update team documentation', description: 'Refresh onboarding docs and API reference pages.', priority: 'Medium', dueDate: '2024-02-20', status: 'pending' },
  { id: 4, name: 'Schedule 1:1 meetings with team', description: 'Set up recurring monthly 1:1s with all direct reports.', priority: 'Medium', dueDate: '2024-02-10', status: 'completed' },
  { id: 5, name: 'Optimize database queries', description: 'Profile slow queries and add missing indexes.', priority: 'Low', dueDate: '2024-02-28', status: 'in-progress' },
  { id: 6, name: 'Design new onboarding flow', description: 'Create wireframes and prototype for the redesigned user onboarding.', priority: 'High', dueDate: '2024-02-18', status: 'pending' },
  { id: 7, name: 'Write unit tests for payment service', description: 'Achieve 80% coverage on the payment processing module.', priority: 'Medium', dueDate: '2024-02-22', status: 'completed' },
  { id: 8, name: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment.', priority: 'Low', dueDate: '2024-03-01', status: 'completed' },
]

const STATUS_CYCLE = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' }

const PRIORITY_COLORS = {
  High: 'bg-red-500/20 text-red-400 border border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Low: 'bg-green-500/20 text-green-400 border border-green-500/30',
}

const STATUS_COLORS = {
  pending: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
  'in-progress': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  completed: 'bg-green-500/20 text-green-400 border border-green-500/30',
}

const STATUS_LABELS = {
  pending: '⏳ Pending',
  'in-progress': '🔄 In Progress',
  completed: '✅ Completed',
}

const EMPTY_FORM = { name: '', description: '', priority: 'Medium', dueDate: '', status: 'pending' }

function ModalInner({ onClose, onSave, editingTask }) {
  const [form, setForm] = useState(editingTask || EMPTY_FORM)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {editingTask ? '✏️ Edit Task' : '➕ Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Task Name <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter task name..."
              required
              className="w-full bg-slate-800 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the task..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              >
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              >
                <option value="pending">⏳ Pending</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all [color-scheme:dark]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-700/60 hover:bg-slate-700 border border-slate-600/50 text-slate-300 font-semibold rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {editingTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Modal({ isOpen, onClose, onSave, editingTask }) {
  if (!isOpen) return null
  return (
    <ModalInner
      key={editingTask ? editingTask.id : 'new'}
      onClose={onClose}
      onSave={onSave}
      editingTask={editingTask}
    />
  )
}

function KanbanColumn({ title, tasks, icon, color, onStatusToggle, onEdit, onDelete }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col gap-3">
      <div className={`flex items-center gap-2 mb-2 pb-3 border-b border-slate-700/50`}>
        <span className="text-lg">{icon}</span>
        <h3 className={`font-bold text-sm ${color}`}>{title}</h3>
        <span className="ml-auto bg-slate-700 text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      {tasks.length === 0 && (
        <div className="text-center py-8 text-slate-600 text-sm">No tasks here</div>
      )}
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-indigo-500/30 transition-colors"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-white text-sm font-semibold leading-snug">{task.name}</h4>
            <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p className="text-slate-500 text-xs mb-3 line-clamp-2">{task.description}</p>
          )}
          {task.dueDate && (
            <p className="text-slate-600 text-xs mb-3">📅 {task.dueDate}</p>
          )}
          <div className="flex items-center justify-between">
            <button
              onClick={() => onStatusToggle(task.id)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Move →
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(task)}
                className="p-1 text-slate-500 hover:text-indigo-400 transition-colors rounded"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-slate-500 hover:text-red-400 transition-colors rounded"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TaskManager() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [view, setView] = useState('list') // 'list' | 'kanban'
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const filteredTasks = tasks.filter((t) => {
    const matchPriority = filterPriority === 'All' || t.priority === filterPriority
    const matchStatus = filterStatus === 'All' || t.status === filterStatus
    return matchPriority && matchStatus
  })

  const handleStatusToggle = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: STATUS_CYCLE[t.status] } : t))
    )
  }

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const handleSave = (form) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...form } : t))
      )
    } else {
      setTasks((prev) => [
        ...prev,
        { ...form, id: Date.now() },
      ])
    }
    setModalOpen(false)
    setEditingTask(null)
  }

  const kanbanColumns = [
    { key: 'pending', title: 'To Do', icon: '📋', color: 'text-slate-300' },
    { key: 'in-progress', title: 'In Progress', icon: '🔄', color: 'text-blue-400' },
    { key: 'completed', title: 'Done', icon: '✅', color: 'text-green-400' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Task Manager</h1>
            <p className="text-slate-400 mt-1">{tasks.length} total tasks</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
          >
            <span>➕</span> Add Task
          </button>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          {/* View Toggle */}
          <div className="flex bg-slate-800/60 border border-slate-700/50 rounded-xl p-1 gap-1">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ☰ List
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'kanban'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⊞ Kanban
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">Priority:</span>
              <div className="flex gap-1">
                {['All', 'High', 'Medium', 'Low'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilterPriority(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filterPriority === p
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">Status:</span>
              <div className="flex gap-1">
                {['All', 'pending', 'in-progress', 'completed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                      filterStatus === s
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <span className="ml-auto text-slate-500 text-sm hidden sm:block">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} shown
          </span>
        </div>

        {/* List View */}
        {view === 'list' && (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-800/60 border-b border-slate-700/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-4">Task</div>
              <div className="col-span-2 text-center">Priority</div>
              <div className="col-span-2 text-center">Due Date</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-medium">No tasks match your filters</p>
                <p className="text-sm mt-1">Try adjusting the priority or status filter</p>
              </div>
            )}

            {filteredTasks.map((task, idx) => (
              <div
                key={task.id}
                className={`grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-slate-700/20 transition-colors ${
                  idx !== filteredTasks.length - 1 ? 'border-b border-slate-700/30' : ''
                }`}
              >
                {/* Name + description */}
                <div className="col-span-4">
                  <p className="text-white text-sm font-semibold truncate">{task.name}</p>
                  {task.description && (
                    <p className="text-slate-500 text-xs mt-0.5 truncate">{task.description}</p>
                  )}
                </div>

                {/* Priority */}
                <div className="col-span-2 flex justify-center">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>

                {/* Due Date */}
                <div className="col-span-2 text-center text-slate-400 text-xs">
                  {task.dueDate || '—'}
                </div>

                {/* Status Toggle */}
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => handleStatusToggle(task.id)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer transition-opacity hover:opacity-75 ${STATUS_COLORS[task.status]}`}
                    title="Click to cycle status"
                  >
                    {STATUS_LABELS[task.status]}
                  </button>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Kanban View */}
        {view === 'kanban' && (
          <div className="grid md:grid-cols-3 gap-5">
            {kanbanColumns.map((col) => (
              <KanbanColumn
                key={col.key}
                title={col.title}
                icon={col.icon}
                color={col.color}
                tasks={filteredTasks.filter((t) => t.status === col.key)}
                onStatusToggle={handleStatusToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null) }}
        onSave={handleSave}
        editingTask={editingTask}
      />
    </div>
  )
}

export default TaskManager
