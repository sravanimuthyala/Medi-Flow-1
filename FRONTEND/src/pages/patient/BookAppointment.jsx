import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Star, MapPin, Video, User, CheckCircle, Loader } from 'lucide-react'
import { getDoctorById, getHospitals } from '../../store/store.js'
import { addAppointment } from '../../store/store.js'
import { useAuth } from '../../context/AuthContext.jsx'

// Day names array – index matches JavaScript's getDay() (0 = Sunday)
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Build the next 7 days as Date objects
function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })
}

export default function BookAppointment() {
  const { doctorId } = useParams()   // from the URL: /patient/book/:doctorId
  const { user } = useAuth()
  const navigate = useNavigate()

  const [doctor, setDoctor] = useState(null)
  const [hospital, setHospital] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Form state ───────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [visitType, setVisitType] = useState('in-person')
  const [reason, setReason] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [booking, setBooking] = useState(false)

  // Fetch doctor and hospital data from backend
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [doc, hospitals] = await Promise.all([
          getDoctorById(doctorId),
          getHospitals(),
        ])
        setDoctor(doc)
        if (doc && hospitals) {
          setHospital(hospitals.find(h => h.id === doc.hospitalId))
        }
      } catch (e) {
        console.error('Failed to load doctor:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [doctorId])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  // Doctor not found
  if (!doctor) {
    return (
      <div className="card text-center py-16 text-gray-400">
        Doctor not found.{' '}
        <Link to="/patient/find-doctors" className="text-blue-600 hover:underline">Go back</Link>
      </div>
    )
  }

  // Get available time slots for the selected date
  const dayName = selectedDate ? DAY_NAMES[selectedDate.getDay()] : null
  const availableSlots = dayName ? (doctor.slots?.[dayName] || []) : []

  // ── Book the appointment (async) ─────────────────────────────────
  async function handleBook() {
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time.')
      return
    }

    setBooking(true)
    setError('')

    try {
      // Create appointment data for backend
      const appointmentData = {
        patientId: user.id,
        doctorId: doctor.id,
        date: selectedDate.toISOString().split('T')[0],  // "YYYY-MM-DD"
        time: selectedTime,
        type: visitType,
        reason: reason,
        fee: doctor.fee,
        status: 'pending',
        payment: 'pending',
      }

      await addAppointment(appointmentData)
      setSuccess(true)

      // After 2.5 seconds, redirect to appointments page
      setTimeout(() => navigate('/patient/appointments'), 2500)
    } catch (e) {
      setError(e.message || 'Failed to book appointment. Please try again.')
    } finally {
      setBooking(false)
    }
  }
  // ── Success screen ───────────────────────────────────────
  if (success) {
    return (
      <div className="card text-center py-16 animate-slide-up max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
        <p className="text-gray-500 text-sm">Your appointment with {doctor.name} has been confirmed.</p>
        <p className="text-xs text-gray-400 mt-2">Redirecting to appointments…</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      {/* Back link */}
      <Link to="/patient/find-doctors" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" /> Back to doctors
      </Link>

      {/* ── Doctor info card ── */}
      <div className="card flex items-start gap-5">
        <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900">{doctor.name}</h1>
          <p className="text-blue-600 font-medium text-sm">{doctor.specialization}</p>
          <p className="text-xs text-gray-400 mt-0.5">{doctor.qualification}</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> {doctor.rating}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" /> {doctor.experience} yrs
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5" /> {hospital?.name}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-2xl font-bold text-gray-900">₹{doctor.fee}</div>
          <div className="text-xs text-gray-400">consultation fee</div>
        </div>
      </div>

      {/* ── Visit type ── */}
      <div className="card">
        <h2 className="font-bold text-gray-900 mb-3">Consultation Type</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'in-person', label: 'In-Person', icon: User, desc: 'Visit the clinic' },
            { value: 'teleconsultation', label: 'Teleconsultation', icon: Video, desc: 'Video call' },
          ].map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setVisitType(t.value)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${visitType === t.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <Icon className={`w-5 h-5 ${visitType === t.value ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className={`text-sm font-medium ${visitType === t.value ? 'text-blue-700' : 'text-gray-600'}`}>{t.label}</p>
                  <p className="text-xs text-gray-400">{t.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Date selection ── */}
      <div className="card">
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" /> Select Date
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {getNext7Days().map(d => {
            const dayName = DAY_NAMES[d.getDay()]
            const hasSlots = (doctor.slots?.[dayName] || []).length > 0
            const isSel = selectedDate?.toDateString() === d.toDateString()

            return (
              <button
                key={d.toISOString()}
                type="button"
                disabled={!hasSlots}
                onClick={() => { setSelectedDate(d); setSelectedTime('') }}
                className={`flex flex-col items-center min-w-[52px] p-2.5 rounded-xl border-2 transition-all ${isSel ? 'border-blue-500 bg-blue-600 text-white' :
                  hasSlots ? 'border-gray-200 hover:border-blue-300 cursor-pointer' :
                    'border-gray-100 opacity-40 cursor-not-allowed'
                  }`}
              >
                <span className={`text-xs font-medium ${isSel ? 'text-blue-100' : 'text-gray-400'}`}>
                  {dayName.slice(0, 3)}
                </span>
                <span className={`text-xl font-bold mt-0.5 ${isSel ? 'text-white' : 'text-gray-900'}`}>
                  {d.getDate()}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Time selection (shown only after a date is picked) ── */}
      {selectedDate && (
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Select Time
          </h2>
          {availableSlots.length === 0 ? (
            <p className="text-gray-400 text-sm">No slots available for this day.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableSlots.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTime(t)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${selectedTime === t
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-gray-200 hover:border-blue-300 text-gray-700'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Reason ── */}
      <div className="card">
        <h2 className="font-bold text-gray-900 mb-3">Reason for Visit</h2>
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="Describe your symptoms or reason for the appointment…"
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Confirm button */}
      <button
        onClick={handleBook}
        disabled={!selectedDate || !selectedTime || booking}
        className="btn-primary w-full py-3 text-base"
      >
        {booking ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          `Confirm Appointment — ₹${doctor.fee}`
        )}
      </button>
    </div>
  )
}
