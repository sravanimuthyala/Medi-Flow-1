import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts'
import { DollarSign, TrendingUp, CreditCard, Activity, Loader } from 'lucide-react'
import { getAppointments, getDoctors } from '../../store/store.js'

const COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6']

export default function RevenueAnalytics() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])

  // Fetch data from backend
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [appts, docs] = await Promise.all([
          getAppointments(),
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
  }, [])

  const paid = appointments.filter(a => a.payment === 'paid')
  const pending = appointments.filter(a => a.payment === 'pending')

  const totalRevenue = paid.reduce((s, a) => s + Number(a.fee), 0)
  const pendingRevenue = pending.reduce((s, a) => s + Number(a.fee), 0)
  const avgFee = paid.length > 0 ? Math.round(totalRevenue / paid.length) : 0

  // Monthly revenue chart
  const monthMap = {}
  paid.forEach(a => {
    const d = new Date(a.date)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    if (!monthMap[key]) monthMap[key] = { month: label, revenue: 0, count: 0 }
    monthMap[key].revenue += Number(a.fee)
    monthMap[key].count++
  })
  const monthlyData = Object.values(monthMap)

  // Revenue by specialization
  const specMap = {}
  paid.forEach(a => {
    const doc = doctors.find(d => d.id === a.doctorId)
    const spec = doc?.specialization || 'Other'
    specMap[spec] = (specMap[spec] || 0) + Number(a.fee)
  })
  const specData = Object.entries(specMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

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
        <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Financial performance overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',      value: `₹${totalRevenue.toLocaleString()}`,   icon: DollarSign,  color: 'bg-green-600'  },
          { label: 'Pending Revenue',    value: `₹${pendingRevenue.toLocaleString()}`, icon: CreditCard,  color: 'bg-yellow-500' },
          { label: 'Paid Consultations', value: paid.length,                            icon: Activity,    color: 'bg-blue-600'   },
          { label: 'Avg Consultation',   value: `₹${avgFee}`,                          icon: TrendingUp,  color: 'bg-teal-600'   },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Monthly revenue bar chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">Monthly Revenue (₹)</h2>
        {monthlyData.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-gray-400 text-sm">
            No revenue data yet. Mark some appointments as paid to see data.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v}`} />
              <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8 }} />
              <Bar dataKey="revenue" fill="#2563eb" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Consultations trend */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Paid Consultations Trend</h2>
          {monthlyData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8 }} />
                <Line type="monotone" dataKey="count" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 4 }} name="Consultations" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Revenue by specialty */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Revenue by Specialty</h2>
          {specData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={specData} cx="50%" cy="50%" outerRadius={70} dataKey="value"
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent*100).toFixed(0)}%`}
                  labelLine={false} fontSize={10}>
                  {specData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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