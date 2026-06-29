import { Outlet, NavLink, Link } from 'react-router-dom'
import { useState } from 'react'
import { Heart, LayoutDashboard, Calendar, Users, FileText, BarChart2, LogOut, Menu, X, Stethoscope } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const navItems = [
  { to: '/doctor',              icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { to: '/doctor/schedule',     icon: Calendar,        label: 'My Schedule'         },
  { to: '/doctor/patients',     icon: Users,           label: 'Patients'            },
  { to: '/doctor/prescriptions',icon: FileText,        label: 'Prescriptions'       },
  { to: '/doctor/analytics',    icon: BarChart2,       label: 'Analytics'           },
]

export default function DoctorLayout() {
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 shadow-sm z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:z-auto`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-400 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-900">Medi<span className="text-teal-600">Flow</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Doctor Menu</p>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'bg-teal-50 text-teal-700' : 'sidebar-link-inactive'}`}>
              <Icon style={{ width: 18, height: 18 }} className="flex-shrink-0" /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-teal-50 mb-2">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-4 h-4 text-teal-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.fullname}</p>
              <p className="text-xs text-gray-500">Doctor</p>
            </div>
          </div>
          <button onClick={signOut} className="sidebar-link sidebar-link-inactive w-full text-red-500 hover:bg-red-50 hover:text-red-600">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-100 h-16 flex items-center px-6 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 mr-4"><Menu className="w-5 h-5" /></button>
          <div className="flex-1" />
          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-teal-600" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
      </div>
    </div>
  )
}