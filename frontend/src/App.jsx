import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import TaskManager from './pages/TaskManager'
import AiChat from './pages/AiChat'
import CalendarView from './pages/CalendarView'
import Settings from './pages/Settings'
import Onboarding from './pages/Onboarding'
import Login from '../src/pages/Login.jsx'


// Onboarding has its own full-screen layout — no Navbar
function AppShell() {
  const { pathname } = useLocation()
  const hideNav = pathname === '/onboarding'

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskManager />} />
        <Route path="/chat" element={<AiChat />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
       
      </Routes>
    </div>
  )
}

function App() {
  return <AppShell />
}

export default App
