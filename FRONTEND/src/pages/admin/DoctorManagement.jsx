import { useState, useEffect } from 'react'
import { Search, Star, Plus, Loader } from 'lucide-react'
import { updateDoctorStatus, getAllDoctors, approveDoctor } from '../../store/store.js'

export default function DoctorManagement() {
  const [loading, setLoading] = useState(true)
  const [docList, setDocList] = useState([])
  const [search, setSearch] = useState('')
  const [showMsg, setShowMsg] = useState('')

  // Fetch data from backend


  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const doctors = await getAllDoctors(search);
        setDocList(doctors);
      } catch (e) {
        console.error("Failed to fetch doctors", e);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);
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

  async function approveDoctorHandler(id) {

    try {

      await approveDoctor(id);

      setDocList(list =>
        list.map(doc =>
          doc.id === id
            ? {
              ...doc,
              onboarding_status: "approved"
            }
            : doc
        )
      );

      setShowMsg("Doctor onboarding approved.");

      setTimeout(() => setShowMsg(""), 2000);

    } catch (e) {

      console.error(e);

      setShowMsg("Failed to approve doctor.");

      setTimeout(() => setShowMsg(""), 2000);
    }

  }

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
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Fee</th>

                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3">Onboarding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {docList.map(doc => {

                return (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {doc?.image ? (
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                            {doc?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-400">{doc.experience} yrs exp</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{doc.specialization}</td>
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
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <span
                          className={
                            doc.onboarding_status === "approved"
                              ? "badge-green"
                              : "badge-yellow"
                          }
                        >
                          {doc.onboarding_status}
                        </span>

                        <button
                          onClick={() => approveDoctorHandler(doc.id)}
                          disabled={doc.onboarding_status === "approved"}
                          className={`text-xs px-3 py-1 rounded-lg transition
        ${doc.onboarding_status === "approved"
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                          {doc.onboarding_status === "pending"
                            ? "Approve"
                            : "Approved"}
                        </button>
                      </div>
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
