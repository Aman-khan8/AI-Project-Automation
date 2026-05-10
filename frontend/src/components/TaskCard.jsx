function TaskCard({ task, onStatusToggle, onEdit, onDelete }) {
  const priorityStyles = {
    High: 'bg-red-500/20 text-red-400 border border-red-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    Low: 'bg-green-500/20 text-green-400 border border-green-500/30',
  }

  const statusStyles = {
    pending: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
    'in-progress': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    completed: 'bg-green-500/20 text-green-400 border border-green-500/30',
  }

  const statusLabels = {
    pending: '⏳ Pending',
    'in-progress': '🔄 In Progress',
    completed: '✅ Completed',
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-2 card-hover">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">{task.name}</h3>
          {task.description && (
            <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-1 mt-2">
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
              {task.priority}
            </span>
            <button
              onClick={() => onStatusToggle(task.id)}
              className={`text-xs font-medium px-1.5 py-0.5 rounded-full cursor-pointer transition-opacity hover:opacity-80 ${statusStyles[task.status]}`}
            >
              {statusLabels[task.status]}
            </button>
            {task.dueDate && (
              <span className="text-xs text-slate-500">📅 {task.dueDate}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-colors"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
