import { Link } from 'react-router-dom'
import { Heart, Calendar, Shield, AlertTriangle, Users, Stethoscope, FileText, ChevronRight, Activity, Star } from 'lucide-react'

// ─── Static data for the landing page ────────────────────────
const stats = [
  { label: 'Registered Patients', value: '50,000+' },
  { label: 'Expert Doctors', value: '1,200+' },
  { label: 'Partner Hospitals', value: '85+' },
  { label: 'Appointments Booked', value: '2M+' },
]

const features = [
  { icon: Calendar, title: 'Smart Scheduling', desc: 'Book appointments with real-time doctor availability. Get instant confirmations and reminders.', color: 'bg-blue-100 text-blue-600' },
  { icon: Stethoscope, title: 'Doctor Discovery', desc: 'Browse verified doctors by specialty, hospital, and experience. Read reviews and compare fees.', color: 'bg-teal-100 text-teal-600' },
  { icon: FileText, title: 'Medical Records', desc: 'Securely store and access your medical history, lab reports, prescriptions, and scans.', color: 'bg-green-100 text-green-600' },
  { icon: Activity, title: 'Teleconsultation', desc: 'Consult doctors from home via video calls. Get prescriptions delivered digitally.', color: 'bg-orange-100 text-orange-600' },
  { icon: AlertTriangle, title: 'Emergency Resources', desc: 'Instantly check ICU beds, ventilators, and blood units at nearby hospitals.', color: 'bg-red-100 text-red-600' },
  { icon: Shield, title: 'Secure & Private', desc: 'Role-based access control. Your health data is protected and encrypted.', color: 'bg-violet-100 text-violet-600' },
]

const portals = [
  {
    title: 'Patient Portal',
    icon: Users,
    desc: 'Find doctors, book appointments, manage your medical records.',
    items: ['Book Appointments', 'Medical History', 'Prescriptions', 'Online Payments'],
    href: '/register',
    cta: 'Get Started as Patient',
    bg: 'from-blue-600 to-blue-700',
  },
  {
    title: 'Doctor Portal',
    icon: Stethoscope,
    desc: 'Manage your schedule, view patient records, write prescriptions.',
    items: ['Appointment Dashboard', 'Patient Records', 'Digital Prescriptions', 'Analytics'],
    href: '/login',
    cta: 'Login as Doctor',
    bg: 'from-teal-600 to-teal-700',
  },
  {
    title: 'Admin Portal',
    icon: Shield,
    desc: 'Oversee all operations, manage staff, monitor queues.',
    items: ['Doctor Management', 'Queue Monitoring', 'Revenue Analytics', 'Notifications'],
    href: '/login',
    cta: 'Admin Login',
    bg: 'from-gray-700 to-gray-800',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Medi<span className="text-blue-600">Flow</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#portals" className="hover:text-blue-600 transition-colors">Portals</a>
            <Link to="/emergency" className="text-red-600 hover:text-red-700 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Emergency
            </Link>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-24 pb-32 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-100 rounded-full opacity-50 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Smart Healthcare Platform
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Healthcare,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              Simplified
            </span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            MediFlow connects patients, doctors, and hospitals on one intelligent platform — reducing wait times and improving care.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-3.5 text-base shadow-lg shadow-blue-200">
              Book an Appointment <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/emergency" className="btn-danger px-8 py-3.5 text-base shadow-lg shadow-red-200">
              <AlertTriangle className="w-5 h-5" /> Emergency Resources
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-4xl font-bold text-gray-900 mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Everything You Need</h2>
            <p className="text-gray-500 text-lg">A comprehensive platform for every healthcare need</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => {
              const Icon = f.icon
              return (
                <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Portals ── */}
      <section id="portals" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Portal</h2>
            <p className="text-gray-500 text-lg">Dedicated experiences for every role</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {portals.map(p => {
              const Icon = p.icon
              return (
                <div key={p.title} className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                  <div className={`bg-gradient-to-r ${p.bg} p-7 text-white`}>
                    <div className="w-13 h-13 bg-white/20 rounded-xl flex items-center justify-center mb-4" style={{ width: 52, height: 52 }}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                    <p className="text-white/80 text-sm">{p.desc}</p>
                  </div>
                  <div className="p-6 bg-white flex-1 flex flex-col">
                    <ul className="space-y-1.5 mb-5 flex-1">
                      {p.items.map(item => (
                        <li key={item} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> {item}
                        </li>
                      ))}
                    </ul>
                    <Link to={p.href} className={`w-full text-center py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r ${p.bg} hover:opacity-90 transition-opacity`}>
                      {p.cta}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Emergency CTA ── */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <AlertTriangle className="w-14 h-14 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-3">Emergency Resource Checker</h2>
          <p className="text-red-100 text-lg mb-8 max-w-xl mx-auto">
            Instantly check ICU beds, ventilators, and blood units at nearby hospitals. No login needed.
          </p>
          <Link to="/emergency" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors shadow-lg">
            <AlertTriangle className="w-5 h-5" /> Check Emergency Resources
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg">MediFlow</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            Smart Healthcare Scheduling &amp; Patient Flow Platform
          </div>
          <p className="text-sm">Built with React + Vite + Tailwind CSS</p>
        </div>
      </footer>
    </div>
  )
}
