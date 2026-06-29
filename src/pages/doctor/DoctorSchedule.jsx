import { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle, XCircle, Loader } from 'lucide-react'
import { getDoctorAppointments, updateAppointmentStatus } from '../../store/store.js'
import { useAuth } from '../../context/AuthContext.jsx'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const statusBadge = {
  pending:   'badge-yellow',
  confirmed: 'badge-blue',
  completed: 'badge-green',
  cancelled: 'badge-red',
}

export default function DoctorSchedule() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  const [allAppts, setAllAppts] = useState([])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Fetch appointments from backend
  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return
      try {
        setLoading(true)
        const appts = await getDoctorAppointments(user.id)
        setAllAppts(appts)
      } catch (e) {
        console.error('Failed to load appointments:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.id])

  // How many empty cells before day 1
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Get appointments for a specific day number
  function getAppts(day) {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return allAppts.filter(a => a.date === dateStr)
  }

  async function markStatus(id, status) {
    try {
      await updateAppointmentStatus(id, status)
      // Refresh appointments
      const updated = await getDoctorAppointments(user.id)
      setAllAppts(updated)
    } catch (e) {
      console.error('Failed to update:', e)
    }
  }

  const selectedAppts = selectedDay ? getAppts(selectedDay) : []

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
        <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-gray-500 text-sm mt-1">Monthly appointment calendar</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Calendar ── */}
        <div className="lg:col-span-2 card">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 text-xl leading-none"
            >
              ‹
            </button>
            <h2 className="text-lg font-bold text-gray-900">{MONTHS[month]} {year}</h2>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 text-xl leading-none"
            >
              ›
            </button>
          </div>

          {/* Day name headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before month starts */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Day buttons */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const dayAppts = getAppts(day)
              const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year
              const isSel = selectedDay === day

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSel ? null : day)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                    isSel ? 'bg-teal-600 text-white' :
                    isToday ? 'bg-teal-50 text-teal-700 font-bold ring-2 ring-teal-300' :
                    'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {day}
                  {/* Dot indicator for days with appointments */}
                  {dayAppts.length > 0 && (
                    <span className={`absolute bottom-1 w-4 h-1 rounded-full ${isSel ? 'bg-white/60' : 'bg-teal-400'}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Selected day detail ── */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            {selectedDay ? `${MONTHS[month]} ${selectedDay}` : 'Select a day'}
          </h3>

          {!selectedDay && (
            <p className="text-gray-400 text-sm text-center py-10">Click on a date to view appointments</p>
          )}

          {selectedDay && selectedAppts.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-10">No appointments this day</p>
          )}

          {selectedDay && selectedAppts.length > 0 && (
            <div className="space-y-3">
              {selectedAppts.map(appt => (
                <div key={appt.id} className="p-3 rounded-xl bg-gray-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-gray-900">
                      Patient #{appt.patientId?.slice(-4)}
                    </p>
                    <span className={statusBadge[appt.status]}>{appt.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {appt.time}
                  </p>

                  {/* Action buttons for pending appointments */}
                  {appt.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => markStatus(appt.id, 'completed')}
                        className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Done
                      </button>
                      <button
                        onClick={() => markStatus(appt.id, 'cancelled')}
                        className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}