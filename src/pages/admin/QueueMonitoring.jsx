import { useState, useEffect } from 'react'
import { Activity, Clock, Users, Loader } from 'lucide-react'
import { getAppointments, getDoctors } from '../../store/store.js'

const statusColor = {
  pending:   'text-yellow-600 bg-yellow-50',
  confirmed: 'text-blue-600 bg-blue-50',
  completed: 'text-green-600 bg-green-50',
  cancelled: 'text-red-600 bg-red-50',
}

export default function QueueMonitoring() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])

  const today = new Date().toISOString().split('T')[0]

  // Fetch data from backend
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [appts, docs] = await Promise.all([
          getAppointments(),
          getDoctors(),
        ])
        setAppointments(appts.filter(a => a.date === today))
        setDoctors(docs)
      } catch (e) {
        console.error('Failed to load data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [today])

  // Group today's appointments by doctor
  const doctorQueues = doctors.map(doc => {
    const appts = appointments
      .filter(a => a.doctorId === doc.id)
      .sort((a, b) => a.time.localeCompare(b.time))
    return { ...doc, appts }
  }).filter(d => d.appts.length > 0)

  const totalWaiting = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length

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
        <h1 className="text-2xl font-bold text-gray-900">Queue Monitoring</h1>
        <p className="text-gray-500 text-sm mt-1">
          Live patient flow — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        Live monitoring — {totalWaiting} patients currently waiting
      </div>

      {doctorQueues.length === 0 ? (
        <div className="card text-center py-20">
          <Activity className="w-14 h-14 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-500">No Active Queues Today</h3>
          <p className="text-gray-400 text-sm mt-1">No appointments are scheduled for today</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {doctorQueues.map(queue => {
            const waiting = queue.appts.filter(a => a.status === 'pending' || a.status === 'confirmed')
            return (
              <div key={queue.id} className="card">
                {/* Doctor info */}
                <div className="flex items-start gap-3 mb-4">
                  <img src={queue.image} alt={queue.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{queue.name}</h3>
                    <p className="text-sm text-teal-600">{queue.specialization}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{waiting.length}</div>
                    <div className="text-xs text-gray-400">waiting</div>
                  </div>
                </div>

                {/* Queue summary */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-3 border-b border-gray-100">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {queue.appts.length} total
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> ~{queue.appts.length * 15} min total wait
                  </span>
                </div>

                {/* Individual patients in queue */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {queue.appts.map((appt, idx) => (
                    <div key={appt.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          Patient #{appt.patientId?.slice(-6)}
                        </p>
                        <p className="text-xs text-gray-400">{appt.time}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[appt.status]}`}>
                        {appt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}