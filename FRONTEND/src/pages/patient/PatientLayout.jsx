import { Outlet, NavLink, Link } from 'react-router-dom'
import { useState } from 'react'
import { Pill, Heart, LayoutDashboard, Search, Calendar, FileText, LogOut, Menu, X, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

// Sidebar navigation items for the patient portal
const navItems = [
  { to: '/patient', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/patient/find-doctors', icon: Search, label: 'Find Doctors' },
  { to: '/patient/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/patient/records', icon: FileText, label: 'Medical Records' },
  { to: '/patient/prescriptions', icon: Pill, label: 'Prescriptions' },
]

export default function PatientLayout() {
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Mobile overlay – clicking it closes the sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 shadow-sm z-40 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-auto
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-900">Medi<span className="text-blue-600">Flow</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            Patient Menu
          </p>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
              }
            >
              <Icon className="flex-shrink-0" style={{ width: 18, height: 18 }} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-blue-50 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.fullname}</p>
              <p className="text-xs text-gray-500">Patient</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="sidebar-link sidebar-link-inactive w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center px-6 gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
        </header>

        {/* Page content rendered here by React Router */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
