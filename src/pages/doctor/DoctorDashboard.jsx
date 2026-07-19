import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, CheckCircle, Activity, Loader } from 'lucide-react'
import {
  getDoctorDashboard,
  getDoctorAppointments,
} from '../../store/store.js'
import { useAuth } from '../../context/AuthContext.jsx'

const statusBadge = {
  pending:   'badge-yellow',
  confirmed: 'badge-blue',
  completed: 'badge-green',
  cancelled: 'badge-red',
}

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
const [stats, setStats] = useState({
  todayAppointments: 0,
  pending: 0,
  completed: 0,
  totalPatients: 0,
});
  // Fetch appointments from backend
useEffect(() => {
  async function fetchData() {
    if (!user?.id) return;

    try {
      setLoading(true);

      const [statsData, appointmentsData] = await Promise.all([
        getDoctorDashboard(user.id),
        getDoctorAppointments(user.id),
      ]);

      setStats(statsData);
      setAppointments(appointmentsData);

    } catch (e) {
      console.error("Failed to load dashboard:", e);
    } finally {
      setLoading(false);
    }
   }

  fetchData();
}, [user?.id]);

  const today = new Date().toISOString().split('T')[0]

  // Stats
  const todayAppts     = appointments.filter(a => a.date === today)
  const pending        = appointments.filter(a => a.status === 'pending')
  const completed      = appointments.filter(a => a.status === 'completed')
  const uniquePatients = new Set(appointments.map(a => a.patientId)).size

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
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white">
        <p className="text-teal-200 text-sm mb-1">Welcome back,</p>
        <h1 className="text-2xl font-bold mb-1">{user?.fullname}</h1>
        <p className="text-teal-100 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          {stats.todayAppointments} appointment{stats.todayAppointments !== 1 ? 's' : ''} scheduled today
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
           { label: "Today's Appointments", value: stats.todayAppointments,  icon: Calendar,    color: 'bg-blue-50 text-blue-600'  },
          { label: 'Pending',              value: stats.pending,     icon: Clock,       color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Completed',            value: stats.completed,   icon: CheckCircle, color: 'bg-green-50 text-green-600'  },
          { label: 'Total Patients',       value: stats.totalPatients,     icon: Users,       color: 'bg-teal-50 text-teal-600'  },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Today's appointments */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-600" /> Today's Appointments
        </h2>
        {stats.todayAppointments.length === 0 ? (
          <div className="text-center py-10">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No appointments today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppts.map(appt => (
              <div key={appt.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm flex-shrink-0">
                  P
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">Patient ID: {appt.patientId?.slice(-6)}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {appt.time}</p>
                </div>
                <span className={statusBadge[appt.status]}>{appt.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent appointments table */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">All Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Fee</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appointments.slice(0, 10).map(appt => (
                <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 text-gray-700">{appt.date}</td>
                  <td className="py-3 text-gray-500">{appt.time}</td>
                  <td className="py-3 text-gray-500 capitalize">{appt.type}</td>
                  <td className="py-3 font-medium text-gray-700">₹{appt.fee}</td>
                  <td className="py-3"><span className={statusBadge[appt.status]}>{appt.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <p className="text-center py-10 text-gray-400 text-sm">No appointments yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
