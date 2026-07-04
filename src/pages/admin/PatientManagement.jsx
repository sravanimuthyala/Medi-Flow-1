import { useState, useEffect } from 'react'
import { Search, Users, Calendar, Mail, Loader } from 'lucide-react'
import { getUsers, getAppointments } from '../../store/store.js'

export default function PatientManagement() {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])

  // Fetch data from backend
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [users, appts] = await Promise.all([
          getUsers(),
          getAppointments(),
        ])
        setPatients(users.filter(u => u.role === 'patient'))
        setAppointments(appts)
      } catch (e) {
        console.error('Failed to load data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Count appointments per patient
  function apptCount(id) {
    return appointments.filter(a => a.patient_id === id).length
  }

  const filtered = patients.filter(p =>
    !search ||
    p.fullname.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  )

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
        <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
        <p className="text-gray-500 text-sm mt-1">{patients.length} registered patients</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" className="input pl-9" placeholder="Search patients…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-500">
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Appointments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                        {p.fullname.charAt(0)}
                      </div>
                      <p className="font-medium text-gray-900">{p.fullname}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 flex items-center gap-1.5 mt-3">
                    <Mail className="w-3.5 h-3.5" /> {p.email}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {apptCount(p.id)}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400">No patients registered yet</p>
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