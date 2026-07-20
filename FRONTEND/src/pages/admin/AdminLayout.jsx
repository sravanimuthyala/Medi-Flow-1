import { Outlet, NavLink, Link } from 'react-router-dom'
import { useState } from 'react'
import { Heart, LayoutDashboard, Stethoscope, Users, Calendar, Activity, BarChart2, LogOut, Menu, X, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/doctors', icon: Stethoscope, label: 'Doctors' },
  { to: '/admin/patients', icon: Users, label: 'Patients' },
  { to: '/admin/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/admin/revenue', icon: BarChart2, label: 'Revenue' },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Dark sidebar for admin */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:z-auto`}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-white">Medi<span className="text-blue-400">Flow</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        {/* Admin badge */}
        <div className="mx-4 mt-4 px-3 py-2 bg-blue-600/20 rounded-xl border border-blue-600/30">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}>
              <Icon style={{ width: 18, height: 18 }} className="flex-shrink-0" /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-gray-800 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullname}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button onClick={signOut} className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-100 h-16 flex items-center px-6 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 mr-4"><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-500 font-medium">System Online</span>
          </div>
          <div className="flex-1" />
          <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
      </div>
    </div>
  )
}