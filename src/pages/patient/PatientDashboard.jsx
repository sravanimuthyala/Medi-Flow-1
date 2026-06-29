import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Search, FileText, ChevronRight, Activity, AlertTriangle, Loader } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getPatientAppointments, getDoctors } from '../../store/store.js'

// Status badge colour mapping
const statusColor = {
  pending:   'badge-yellow',
  confirmed: 'badge-blue',
  completed: 'badge-green',
  cancelled: 'badge-red',
}

export default function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch data from backend
  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return
      try {
        setLoading(true)
        const [appts, docs] = await Promise.all([
          getPatientAppointments(user.id),
          getDoctors(),
        ])
        setAppointments(appts)
        setDoctors(docs)
      } catch (e) {
        console.error('Failed to load data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.id])

  const upcoming = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed')
  const today = new Date().toISOString().split('T')[0]

  // Quick-link cards
  const quickLinks = [
    { to: '/patient/find-doctors', icon: Search,        label: 'Find Doctors',     desc: 'Browse specialists',  color: 'bg-blue-50 text-blue-600' },
    { to: '/patient/appointments', icon: Calendar,      label: 'Appointments',     desc: 'View & manage',       color: 'bg-teal-50 text-teal-600' },
    { to: '/patient/records',      icon: FileText,      label: 'Medical Records',  desc: 'Upload & access',     color: 'bg-green-50 text-green-600' },
    { to: '/emergency',            icon: AlertTriangle, label: 'Emergency',        desc: 'Check resources',     color: 'bg-red-50 text-red-600' },
  ]

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <p className="text-blue-200 text-sm mb-1">Good day,</p>
        <h1 className="text-2xl font-bold mb-2">{user?.fullname}</h1>
        <p className="text-blue-100 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          {upcoming.length} upcoming appointment{upcoming.length !== 1 ? 's' : ''}
        </p>
        <Link
          to="/patient/find-doctors"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
        >
          Book New Appointment <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Quick links grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickLinks.map(({ to, icon: Icon, label, desc, color }) => (
          <Link key={to} to={to} className="card hover:shadow-md transition-all hover:-translate-y-0.5 p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Upcoming appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
          <Link to="/patient/appointments" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="text-center py-10">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No upcoming appointments</p>
            <Link to="/patient/find-doctors" className="mt-3 btn-primary text-sm px-4 py-2 inline-flex">
              Book Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 5).map(appt => {
              // Find doctor details
              const doc = doctors.find(d => d.id === appt.doctorId)
              return (
                <div key={appt.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{doc?.name || 'Doctor'}</p>
                    <p className="text-xs text-gray-500">{doc?.specialization}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {appt.date}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {appt.time}
                      </span>
                    </div>
                  </div>
                  <span className={statusColor[appt.status]}>{appt.status}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Visits',  value: appointments.filter(a => a.status === 'completed').length, color: 'bg-green-50 text-green-600' },
          { label: 'Pending',       value: appointments.filter(a => a.status === 'pending').length,   color: 'bg-yellow-50 text-yellow-600' },
          { label: "Today's",       value: appointments.filter(a => a.date === today).length,          color: 'bg-blue-50 text-blue-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center p-4">
            <div className={`text-2xl font-bold ${color.split(' ')[1]}`}>{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
