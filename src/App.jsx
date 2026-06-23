/**
 * App.jsx
 * -------
 * Main file that sets up all page routes.
 * React Router handles switching between pages without reloading.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

// ── Pages ─────────────────────────────────────────
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

// Patient portal
import PatientLayout from './pages/patient/PatientLayout.jsx'
import PatientDashboard from './pages/patient/PatientDashboard.jsx'
import FindDoctors from './pages/patient/FindDoctors.jsx'
import BookAppointment from './pages/patient/BookAppointment.jsx'
import MyAppointments from './pages/patient/MyAppointments.jsx'
import MedicalRecords from './pages/patient/MedicalRecords.jsx'

// Doctor portal
import DoctorLayout from './pages/doctor/DoctorLayout.jsx'
import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx'
import DoctorSchedule from './pages/doctor/DoctorSchedule.jsx'
import DoctorPatients from './pages/doctor/DoctorPatients.jsx'
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions.jsx'
import DoctorAnalytics from './pages/doctor/DoctorAnalytics.jsx'

// Admin portal
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import DoctorManagement from './pages/admin/DoctorManagement.jsx'
import PatientManagement from './pages/admin/PatientManagement.jsx'
import AppointmentMonitoring from './pages/admin/AppointmentMonitoring.jsx'
import QueueMonitoring from './pages/admin/QueueMonitoring.jsx'
import RevenueAnalytics from './pages/admin/RevenueAnalytics.jsx'

// Emergency page
import EmergencyResources from './pages/emergency/EmergencyResources.jsx'

// ── ProtectedRoute: redirects to /login if not signed in ──────
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  // Show spinner while checking localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in → go to login page
  if (!user) return <Navigate to="/login" replace />

  // Wrong role → redirect to correct portal
  if (role && user.role !== role) {
    if (user.role === 'doctor') return <Navigate to="/doctor" replace />
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    return <Navigate to="/patient" replace />
  }

  return children
}

// ── After login, redirect to the correct portal ──────────────
function RoleRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'doctor') return <Navigate to="/doctor" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  return <Navigate to="/patient" replace />
}

// ── All routes defined here ───────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/emergency" element={<EmergencyResources />} />
      <Route path="/dashboard" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />

      {/* Patient portal (role must be 'patient') */}
      <Route path="/patient" element={<ProtectedRoute role="patient"><PatientLayout /></ProtectedRoute>}>
        <Route index element={<PatientDashboard />} />
        <Route path="find-doctors" element={<FindDoctors />} />
        <Route path="book/:doctorId" element={<BookAppointment />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="records" element={<MedicalRecords />} />
      </Route>

      {/* Doctor portal (role must be 'doctor') */}
      <Route path="/doctor" element={<ProtectedRoute role="doctor"><DoctorLayout /></ProtectedRoute>}>
        <Route index element={<DoctorDashboard />} />
        <Route path="schedule" element={<DoctorSchedule />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="prescriptions" element={<DoctorPrescriptions />} />
        <Route path="analytics" element={<DoctorAnalytics />} />
      </Route>

      {/* Admin portal (role must be 'admin') */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="doctors" element={<DoctorManagement />} />
        <Route path="patients" element={<PatientManagement />} />
        <Route path="appointments" element={<AppointmentMonitoring />} />
        <Route path="queue" element={<QueueMonitoring />} />
        <Route path="revenue" element={<RevenueAnalytics />} />
      </Route>

      {/* Catch-all → home page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
