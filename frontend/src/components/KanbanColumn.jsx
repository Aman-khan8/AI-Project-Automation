import React from 'react';

function KanbanColumn({ title, tasks, icon, color, onStatusToggle, onEdit, onDelete, PRIORITY_COLORS }) {
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
  );
}

export default KanbanColumn;
