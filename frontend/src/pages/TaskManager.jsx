import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskModal from '../components/TaskModal';
import KanbanColumn from '../components/KanbanColumn';
import { useSelector } from 'react-redux';



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
};

const STATUS_LABELS = {
  pending: '⏳ Pending',
  'in-progress': '🔄 In Progress',
  completed: '✅ Completed',
}



function TaskManager() {
  const [tasks, setTasks] = useState([])
  const isLogin = useSelector((state) => state.login.login);
    // Fetch tasks from backend on mount
    useEffect(() => {
      const fetchTasks = async () => {
        try {
          if(!isLogin) return;
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/tasks/fetchTasks`,{
            withCredentials:true,
          });
          if(res.statuscode === 200){
            setTasks(res.data.tasks || []);
          }
          else{
            console.error("Failed to fetch tasks :", res.message);
          }
        } catch (err) {
          setTasks([]);
          console.error("Error fetching tasks:", err);
        }
      };
      fetchTasks();
    }, []);
  const [view, setView] = useState('list') // 'list' | 'kanban'
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const filteredTasks = tasks.filter((t) => {
    const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchPriority && matchStatus;
  });
   
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
            <p className="text-slate-400 mt-1">{tasks?.length || 0} total tasks</p>
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
                {tasks.length === 0 ? (
                  <>
                    <p className="font-medium">No tasks found</p>
                    { isLogin ? <p className="text-sm mt-1">Click "Add Task" to create your first task!</p>
                     : (
                      <p className="text-sm mt-1">Please log in to view your tasks.</p>
                    )}
                    
                  </>
                ) : (
                  <>
                    <p className="font-medium">No tasks match your filters</p>
                    <p className="text-sm mt-1">Try adjusting the priority or status filter</p>
                  </>
                )}
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
                PRIORITY_COLORS={PRIORITY_COLORS}
              />
            ))}
          </div>
        )}

      </div>

      {/* Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
        editingTask={editingTask}
      />
    </div>
  )
}

export default TaskManager
