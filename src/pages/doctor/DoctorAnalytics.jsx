import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { TrendingUp, DollarSign, Users, Calendar, Loader } from 'lucide-react'
import { getDoctorAppointments } from '../../store/store.js'
import { useAuth } from '../../context/AuthContext.jsx'

const PIE_COLORS = ['#0d9488', '#3b82f6', '#f59e0b', '#ef4444']

export default function DoctorAnalytics() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])

  // Fetch appointments from backend
  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return
      try {
        setLoading(true)
        const appts = await getDoctorAppointments(user.id)
        setAppointments(appts)
      } catch (e) {
        console.error('Failed to load appointments:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.id])

  // ── Summary numbers ───────────────────────────────────────
  const total = appointments.length
  const paid = appointments.filter(a => a.payment === 'paid')
  const revenue = paid.reduce((sum, a) => sum + Number(a.fee), 0)
  const patients = new Set(appointments.map(a => a.patientId)).size
  const doneRate = total > 0 ? Math.round((appointments.filter(a => a.status === 'completed').length / total) * 100) : 0

  // ── Monthly bar chart data ────────────────────────────────
  const monthlyMap = {}
  appointments.forEach(a => {
    const d = new Date(a.date)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    if (!monthlyMap[key]) monthlyMap[key] = { month: label, count: 0, revenue: 0 }
    monthlyMap[key].count++
    if (a.payment === 'paid') monthlyMap[key].revenue += Number(a.fee)
  })
  const monthlyData = Object.values(monthlyMap)

  // ── Status pie chart data ─────────────────────────────────
  const statusData = [
    { name: 'Completed', value: appointments.filter(a => a.status === 'completed').length },
    { name: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length },
    { name: 'Pending',   value: appointments.filter(a => a.status === 'pending').length   },
    { name: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length },
  ].filter(d => d.value > 0)

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Your consultation performance overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Appointments', value: total,                  icon: Calendar,   color: 'bg-blue-50 text-blue-600'   },
          { label: 'Revenue Earned',     value: `₹${revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-teal-50 text-teal-600'    },
          { label: 'Unique Patients',    value: patients,               icon: Users,      color: 'bg-green-50 text-green-600' },
          { label: 'Completion Rate',    value: `${doneRate}%`,         icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Monthly appointments bar chart */}
      <div className="card">
        <h2 className="text-base font-bold text-gray-900 mb-4">Monthly Appointments</h2>
        {monthlyData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
            No data yet — book some appointments first!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="count" fill="#0d9488" radius={[4,4,0,0]} name="Appointments" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="card">
          <h2 className="text-base font-bold text-gray-900 mb-4">Monthly Revenue (₹)</h2>
          {monthlyData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => [`₹${v}`, 'Revenue']} contentStyle={{ borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status pie chart */}
        <div className="card">
          <h2 className="text-base font-bold text-gray-900 mb-4">Appointment Status</h2>
          {statusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={70} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                  labelLine={false} fontSize={11}>
                  {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}