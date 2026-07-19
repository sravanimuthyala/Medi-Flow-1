import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Stethoscope, Calendar, DollarSign, CheckCircle, Clock, TrendingUp, Activity, Loader } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getAppointments, getUsers, getDoctors, getHospitals } from '../../store/store.js'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])
  const [users, setUsers] = useState([])
  const [doctors, setDoctors] = useState([])
  const [hospitals, setHospitals] = useState([])

  // Fetch data from backend
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [appts, allUsers, docs, hosp] = await Promise.all([
          getAppointments(),
          getUsers(),
          getDoctors(),
          getHospitals(),
        ])
        setAppointments(appts)
        setUsers(allUsers.filter(u => u.role === 'patient'))
        setDoctors(docs)
        setHospitals(hosp)
      } catch (e) {
        console.error('Failed to load data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const revenue = appointments.filter(a => a.payment === 'paid').reduce((s, a) => s + Number(a.fee), 0)
  const todayAppts = appointments.filter(a => a.date === today)

  // Build monthly chart data from appointments
  const monthMap = {}
  appointments.forEach(a => {
    const d = new Date(a.date)
    const label = d.toLocaleString('default', { month: 'short' })
    monthMap[label] = (monthMap[label] || 0) + 1
  })
  const chartData = Object.entries(monthMap).map(([month, count]) => ({ month, count }))

  const recentAppts = appointments.slice(-5).reverse()

  const statusBadge = { pending: 'badge-yellow', confirmed: 'badge-blue', completed: 'badge-green', cancelled: 'badge-red' }

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Patients',      value: users.length,        icon: Users,      color: 'bg-blue-600',   link: '/admin/patients'  },
          { label: 'Doctors',       value: doctors.length,      icon: Stethoscope,color: 'bg-teal-600',   link: '/admin/doctors'   },
          { label: 'Appointments',  value: appointments.length, icon: Calendar,   color: 'bg-green-600',  link: '/admin/appointments' },
          { label: 'Revenue',       value: `₹${revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-orange-500', link: '/admin/revenue' },
        ].map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} to={link} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Today's Appts",  value: todayAppts.length,                                             color: 'text-blue-600 bg-blue-50',    icon: Clock          },
          { label: 'Pending',        value: appointments.filter(a => a.status === 'pending').length,       color: 'text-yellow-600 bg-yellow-50', icon: Clock          },
          { label: 'Completed',      value: appointments.filter(a => a.status === 'completed').length,     color: 'text-green-600 bg-green-50',  icon: CheckCircle    },
          { label: 'Hospitals',      value: hospitals.length,                                              color: 'text-teal-600 bg-teal-50',    icon: Activity       },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Appointments trend */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Appointment Trends
          </h2>
          {chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No appointment data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8 }} />
                <Bar dataKey="count" fill="#2563eb" radius={[4,4,0,0]} name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent appointments */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Recent Appointments</h2>
          {recentAppts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No appointments yet</p>
          ) : (
            <div className="space-y-3">
              {recentAppts.map(appt => {
                const doc = doctors.find(d => d.id === appt.doctorId)
                return (
                  <div key={appt.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-xs font-bold flex-shrink-0">
                      P
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Patient #{appt.patientId?.slice(-6)}</p>
                      <p className="text-xs text-gray-400 truncate">{doc?.name} — {appt.date}</p>
                    </div>
                    <span className={statusBadge[appt.status]}>{appt.status}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}