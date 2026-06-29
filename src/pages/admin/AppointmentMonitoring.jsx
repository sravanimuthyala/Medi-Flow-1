import { useState, useEffect } from 'react'
import { Calendar, Search, Loader } from 'lucide-react'
import { getAppointments, updateAppointmentStatus, getDoctors } from '../../store/store.js'

const statusBadge = {
  pending:   'badge-yellow',
  confirmed: 'badge-blue',
  completed: 'badge-green',
  cancelled: 'badge-red',
}

export default function AppointmentMonitoring() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatus] = useState('')
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

  async function update(id, status) {
    try {
      await updateAppointmentStatus(id, status)
      // Refresh appointments
      const updated = await getAppointments()
      setAppointments(updated)
    } catch (e) {
      console.error('Failed to update:', e)
    }
  }

  const filtered = appointments.filter(a => {
    const doc = doctors.find(d => d.id === a.doctorId)
    const matchSearch = !search || doc?.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || a.status === statusFilter
    return matchSearch && matchStatus
  })

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
        <h1 className="text-2xl font-bold text-gray-900">Appointment Monitoring</h1>
        <p className="text-gray-500 text-sm mt-1">{appointments.length} total appointments</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" className="input pl-9" placeholder="Search by doctor name…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {['pending','confirmed','completed','cancelled'].map(s => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-500">
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Doctor</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Fee</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(appt => {
                const doc = doctors.find(d => d.id === appt.doctorId)
                return (
                  <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">#{appt.patientId?.slice(-6)}</td>
                    <td className="px-4 py-3 text-gray-600">{doc?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{appt.date}</td>
                    <td className="px-4 py-3 text-gray-500">{appt.time}</td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{appt.type}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">₹{appt.fee}</td>
                    <td className="px-4 py-3"><span className={statusBadge[appt.status]}>{appt.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {appt.status === 'pending' && (
                          <button onClick={() => update(appt.id, 'confirmed')} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors">Confirm</button>
                        )}
                        {appt.status === 'confirmed' && (
                          <button onClick={() => update(appt.id, 'completed')} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors">Complete</button>
                        )}
                        {(appt.status === 'pending' || appt.status === 'confirmed') && (
                          <button onClick={() => update(appt.id, 'cancelled')} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors">Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400">No appointments found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}