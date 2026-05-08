import { NavLink, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-indigo-400 bg-indigo-500/10'
        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">⚡ TaskAI</span>
          </NavLink>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
            <NavLink to="/tasks" className={navLinkClass}>Tasks</NavLink>
            <NavLink to="/chat" className={navLinkClass}>AI Chat</NavLink>
            <NavLink to="/calendar" className={navLinkClass}>Calendar</NavLink>
            <NavLink to="/settings" className={navLinkClass}>Settings</NavLink>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            {/* Mobile nav links */}
            <div className="flex md:hidden items-center gap-1 overflow-x-auto max-w-[60vw] scrollbar-none">
              <NavLink to="/" end className={navLinkClass}>Home</NavLink>
              <NavLink to="/dashboard" className={navLinkClass}>Dash</NavLink>
              <NavLink to="/tasks" className={navLinkClass}>Tasks</NavLink>
              <NavLink to="/chat" className={navLinkClass}>Chat</NavLink>
              <NavLink to="/calendar" className={navLinkClass}>Cal</NavLink>
              <NavLink to="/settings" className={navLinkClass}>⚙️</NavLink>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-lg shadow-indigo-500/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
