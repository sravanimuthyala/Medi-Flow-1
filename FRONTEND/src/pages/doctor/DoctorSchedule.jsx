import { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle, XCircle, Loader } from 'lucide-react'
import { getDoctorAppointments, updateAppointmentStatus, getDoctorSlots, updateDoctorSlots } from '../../store/store.js'
import { useAuth } from '../../context/AuthContext.jsx'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const statusBadge = {
  pending: 'badge-yellow',
  confirmed: 'badge-blue',
  completed: 'badge-green',
  cancelled: 'badge-red',
}

export default function DoctorSchedule() {
  const { user } = useAuth()
  const [dialog, setDialog] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date();
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [selectedDay, setSelectedDay] = useState(today.getDate()); const [allAppts, setAllAppts] = useState([])
  const [slots, setSlots] = useState({})
  const [newSlot, setNewSlot] = useState("")
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const WEEK_DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]

  const selectedWeekDay =
    selectedDay
      ? WEEK_DAYS[
      new Date(
        year,
        month,
        selectedDay
      ).getDay()
      ]
      : null
  // Fetch appointments from backend
  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return
      try {
        setLoading(true)
        const appts = await getDoctorAppointments(user.id)
        setAllAppts(appts)
        const slotData =
          await getDoctorSlots(user.id);

        if (slotData?.slots) {
          setSlots(slotData.slots)
        } else {
          setSlots([])
        }
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
    return allAppts.filter(a => {
      const apptDate = new Date(a.date)

      return (
        apptDate.getDate() === day &&
        apptDate.getMonth() === month &&
        apptDate.getFullYear() === year
      )
    })
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

  async function saveSlots() {
    await updateDoctorSlots(
      user.id,
      slots
    );
    setDialog({
      open: true,
      type: "success",
      title: "Slots Saved",
      message: "Your available slots have been updated successfully."
    });
  }

  function addSlot() {

    const selectedDate = new Date(year, month, selectedDay);
    const now = new Date();

    if (!selectedWeekDay || !selectedDay) return;

    const newSlot = `${hour}:${minute}`;

    const hours = Number(hour);
    const minutes = Number(minute);
    selectedDate.setHours(hours, minutes, 0, 0);

    if (selectedDate < now) {
      setDialog({
        open: true,
        type: "error",
        title: "Invalid Time",
        message: "You can't add a slot for a past date or time."
      });
      return;
    }

    const existingSlots = slots[selectedWeekDay] || [];

    if (existingSlots.includes(newSlot)) {
      setDialog({
        open: true,
        type: "error",
        title: "Duplicate Slot",
        message: "This time slot already exists. Please select a different time."
      });
      return;
    }

    setSlots({
      ...slots,
      [selectedWeekDay]: [...existingSlots, newSlot],
    });

    setNewSlot("");
  }

  function removeSlot(index) {
    setSlots({
      ...slots,
      [selectedWeekDay]:
        slots[selectedWeekDay].filter(
          (_, i) => i !== index
        )
    })
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
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${isSel ? 'bg-teal-600 text-white' :
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
          <div className="mb-4 border-b border-gray-100 pb-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Available Slots
            </h4>
            <p className="text-sm text-gray-500 mb-2">
              {selectedWeekDay || "Select a day"}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="h-11 w-24 rounded-xl border border-gray-300 bg-white px-3 text-center text-gray-700 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 outline-none"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>

              <span className="text-xl font-bold text-gray-600">:</span>

              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="h-11 w-24 rounded-xl border border-gray-300 bg-white px-3 text-center text-gray-700 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="00">00</option>
                <option value="30">30</option>
              </select>

              <button
                onClick={addSlot}
                className="h-11 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedWeekDay &&
                slots[selectedWeekDay]?.map(
                  (slot, index) => (
                    <div
                      key={index}
                      className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {slot}

                      <button
                        onClick={() =>
                          removeSlot(index)
                        }
                        className="font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
            </div>
            <button
              onClick={saveSlots}
              className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-xl font-medium transition"
            >
              Save Slots
            </button>
          </div>
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
                      {appt.patient_name}
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
      {dialog.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6">

            <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center
        ${dialog.type === "success"
                ? "bg-teal-100 text-teal-600"
                : "bg-red-100 text-red-600"
              }`}>

              {dialog.type === "success" ? (
                <CheckCircle className="w-7 h-7" />
              ) : (
                <XCircle className="w-7 h-7" />
              )}
            </div>

            <h2 className="text-xl font-bold text-center mt-4">
              {dialog.title}
            </h2>

            <p className="text-gray-500 text-center mt-2">
              {dialog.message}
            </p>

            <button
              onClick={() =>
                setDialog({
                  open: false,
                  title: "",
                  message: "",
                  type: "",
                })
              }
              className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-xl"
            >
              OK
            </button>

          </div>
        </div>
      )}
    </div>
  )

}