import { useState, useEffect } from 'react'
import { Search, Users, Calendar, Loader } from 'lucide-react'
import { getDoctorAppointments, getPatientMedicalRecords, updateAppointmentStatus } from '../../store/store.js'
import { useNavigate } from "react-router-dom";


import { useAuth } from '../../context/AuthContext.jsx'

const statusBadge = {
  pending: 'badge-yellow',
  confirmed: 'badge-blue',
  completed: 'badge-green',
  cancelled: 'badge-red',
}

export default function DoctorPatients() {
  const { user } = useAuth()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [appointments, setAppointments] = useState([])

  // Fetch appointments from backend
  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return
      try {
        setLoading(true)
        const appts = await getDoctorAppointments(user.id)
        setAppointments(appts)
      } catch (e) {
        console.error('Failed to load appointments:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.id])

  // Build a map of unique patients from appointments
  const patientMap = {};

  appointments.forEach(a => {
    if (!patientMap[a.patient_id]) {
      patientMap[a.patient_id] = {
        patientId: a.patient_id,
        patientName: a.patient_name,
        appointments: [],
      };
    }

    patientMap[a.patient_id].appointments.push(a);
  });

  const patients = Object.values(patientMap);

  // Filter by search
  const filtered = patients.filter(p =>
    !search ||
    p.patientName.toLowerCase().includes(search.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    )
  }
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId
            ? { ...appt, status: newStatus }
            : appt
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update appointment status");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <p className="text-gray-500 text-sm mt-1">{patients.length} patients in your care</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" className="input pl-9" placeholder="Search by patient name…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No patients found</p>
          <p className="text-gray-300 text-xs mt-1">Patients appear here once they book appointments</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((p, index) => {
            const isSelected = selected === p.patientId
            const lastAppt = p.appointments[p.appointments.length - 1]

            return (
              <button
                key={`${p.patientId}-${index}`} onClick={() => setSelected(isSelected ? null : p.patientId)}
                className={`card text-left hover:shadow-md transition-all border-2 ${isSelected ? 'border-teal-400' : 'border-gray-100'
                  }`}
              >
                {/* Patient header */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold flex-shrink-0">
                    P
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                      {p.patientName}
                    </h3>

                    <p className="text-xs text-gray-500">
                      Patient ID: {p.patientId}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Last visit:{" "}
                      {lastAppt?.date
                        ? new Date(lastAppt.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        : "N/A"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-teal-600">{p.appointments.length}</div>
                    <div className="text-xs text-gray-400">visits</div>
                  </div>
                </div>

                {/* Appointment history (shown when selected) */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/doctor/patients/${p.patientId}/records`);
                        }}
                        className="mb-5 px-3 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
                      >
                        View Medical Records
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Appointment History
                    </p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {p.appointments.map((a) => (
                        <div
                          key={a.id}
                          className="pb-2 border-b border-gray-100 flex justify-between items-start"
                        >
                          <div>
                            <p className="text-gray-600">
                              {new Date(a.date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}{" "}
                              at {a.time}
                            </p>

                            <p className="text-gray-500">
                              <span className="font-medium">Reason:</span> {a.reason}
                            </p>
                          </div>

                          <select
                            value={a.status}
                            disabled={a.status === "completed" || a.status === "cancelled"}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStatusChange(a.id, e.target.value)}
                            className={`border rounded-md px-2 py-1 text-xs ${a.status === "completed" || a.status === "cancelled"
                              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : ""
                              }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}