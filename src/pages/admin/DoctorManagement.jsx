import { useState, useEffect } from 'react'
import { Search, Star, Plus, Loader } from 'lucide-react'
import { getDoctors, updateDoctorStatus, getHospitals } from '../../store/store.js'

export default function DoctorManagement() {
  const [loading, setLoading] = useState(true)
  const [docList, setDocList] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [search, setSearch] = useState('')
  const [showMsg, setShowMsg] = useState('')

  // Fetch data from backend
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [doctors, hosp] = await Promise.all([
          getDoctors(),
          getHospitals(),
        ])
        // Add active status to doctors if not present
        setDocList(doctors.map(d => ({ ...d, active: d.active ?? true })))
        setHospitals(hosp)
      } catch (e) {
        console.error('Failed to load doctors:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  async function toggleActive(id) {
    try {
      const doc = docList.find(d => d.id === id)
      const newStatus = !doc.active
      await updateDoctorStatus(id, newStatus)
      setDocList(list => list.map(d => d.id === id ? { ...d, active: newStatus } : d))
      setShowMsg('Doctor status updated.')
      setTimeout(() => setShowMsg(''), 2000)
    } catch (e) {
      console.error('Failed to update status:', e)
      setShowMsg('Failed to update status.')
      setTimeout(() => setShowMsg(''), 2000)
    }
  }

  const filtered = docList.filter(d =>
    !search ||
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-gray-500 text-sm mt-1">{docList.length} registered doctors</p>
        </div>
        <div className="flex items-center gap-2">
          {showMsg && <span className="text-sm text-green-600 font-medium">{showMsg}</span>}
          <button className="btn-primary text-sm px-4 py-2">
            <Plus className="w-4 h-4" /> Add Doctor
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" className="input pl-9" placeholder="Search doctors…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-500">
                <th className="px-4 py-3 font-medium">Doctor</th>
                <th className="px-4 py-3 font-medium">Specialization</th>
                <th className="px-4 py-3 font-medium">Hospital</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Fee</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(doc => {
                const hosp = hospitals.find(h => h.id === doc.hospitalId)
                return (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={doc.image} alt={doc.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-400">{doc.experience} yrs exp</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{doc.specialization}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[130px] truncate">{hosp?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-yellow-600 font-medium">
                        <Star className="w-3.5 h-3.5 fill-yellow-400" />{doc.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">₹{doc.fee}</td>
                    <td className="px-4 py-3">
                      <span className={doc.active ? 'badge-green' : 'badge-red'}>
                        {doc.active ? 'active' : 'inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(doc.id)}
                        className="text-xs px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        {doc.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}