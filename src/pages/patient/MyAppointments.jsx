import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Video, User, X, Plus, Loader } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getPatientAppointments, cancelAppointment, getDoctors, getHospitals } from '../../store/store.js'

const ALL_TABS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled']

const statusBadge = {
  pending:   'badge-yellow',
  confirmed: 'badge-blue',
  completed: 'badge-green',
  cancelled: 'badge-red',
}

export default function MyAppointments() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('All')
  const [loading, setLoading] = useState(true)

  const [allAppts, setAllAppts] = useState([])
  const [doctors, setDoctors] = useState([])
  const [hospitals, setHospitals] = useState([])

  // Fetch data from backend
  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return
      try {
        setLoading(true)
        const [appts, docs, hosp] = await Promise.all([
          getPatientAppointments(user.id),
          getDoctors(),
          getHospitals(),
        ])
        setAllAppts(appts)
        setDoctors(docs)
        setHospitals(hosp)
      } catch (e) {
        console.error('Failed to load appointments:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.id])

  // Filter by active tab
  const filtered = allAppts.filter(a =>
    activeTab === 'All' || a.status === activeTab.toLowerCase()
  )

  async function handleCancel(id) {
    try {
      await cancelAppointment(id)
      // Refresh appointments list
      const updated = await getPatientAppointments(user.id)
      setAllAppts(updated)
    } catch (e) {
      console.error('Failed to cancel:', e)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">{allAppts.length} total</p>
        </div>
        <Link to="/patient/find-doctors" className="btn-primary text-sm px-4 py-2">
          <Plus className="w-4 h-4" /> Book New
        </Link>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {ALL_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {tab !== 'All' && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'
              }`}>
                {allAppts.filter(a => a.status === tab.toLowerCase()).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Appointment list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No {activeTab.toLowerCase()} appointments</p>
          <Link to="/patient/find-doctors" className="mt-3 btn-primary text-sm px-4 py-2 inline-flex">
            Book Appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(appt => {
            const doc  = doctors.find(d => d.id === appt.doctorId)
            const hosp = hospitals.find(h => h.id === doc?.hospitalId)
            const canCancel = appt.status === 'pending' || appt.status === 'confirmed'

            return (
              <div key={appt.id} className="card hover:shadow-md transition-all p-5">
                <div className="flex items-start gap-4">
                  {/* Doctor photo */}
                  <img
                    src={doc?.image || ''}
                    alt={doc?.name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Name + status badge */}
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-bold text-gray-900">{doc?.name}</h3>
                        <p className="text-sm text-blue-600">{doc?.specialization}</p>
                      </div>
                      <span className={statusBadge[appt.status]}>{appt.status}</span>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {appt.date}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {appt.time}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        {appt.type === 'teleconsultation'
                          ? <><Video className="w-3.5 h-3.5" /> Teleconsultation</>
                          : <><User className="w-3.5 h-3.5" /> In-Person</>
                        }
                      </span>
                      {hosp && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {hosp.name}
                        </span>
                      )}
                    </div>

                    {/* Reason */}
                    {appt.reason && (
                      <p className="text-xs text-gray-400 mt-1.5 italic">"{appt.reason}"</p>
                    )}
                  </div>

                  {/* Cancel button */}
                  {canCancel && (
                    <button
                      onClick={() => handleCancel(appt.id)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancel appointment"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Fee row */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">₹{appt.fee}</span>
                  <span className={appt.payment === 'paid' ? 'badge-green' : 'badge-yellow'}>
                    {appt.payment}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
