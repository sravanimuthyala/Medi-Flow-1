import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Eye, EyeOff, UserPlus, User, Stethoscope, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

// The three roles a user can pick
const roles = [
  { value: 'patient', label: 'Patient',  icon: User,        desc: 'Book appointments & manage health', selectedColor: 'border-blue-500 bg-blue-50' },
  { value: 'doctor',  label: 'Doctor',   icon: Stethoscope, desc: 'Manage schedule & patients',       selectedColor: 'border-teal-500 bg-teal-50' },
  { value: 'admin',   label: 'Admin',    icon: Shield,      desc: 'Oversee hospital operations',      selectedColor: 'border-gray-500 bg-gray-50' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  // ── Form state ───────────────────────────────────────────
  const [role, setRole] = useState('patient')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [specialization, setSpecialization] = useState('')
  const [department, setDepartment] = useState('')
  const [qualification, setQualification] = useState('')
  const [experience, setExperience] = useState('')
  const [fee, setFee] = useState('')
  const [hospitalId, setHospitalId] = useState('')
  const [bio, setBio] = useState('')
  const [image, setImage] = useState('')

  // ── Handle form submit (async) ─────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

const result = await register({
  fullname: name,
  email,
  password,
  role,
  phone,
  specialization,
  department,
  qualification,
  experience,
  fee,
  hospitalId,
  bio,
  image
});
    if (result.error) {
      console.log(result)
      setError(result.error)

      setLoading(false)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-slide-up">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Medi<span className="text-blue-600">Flow</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm">Create your healthcare account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm mb-6">Join MediFlow and access healthcare services</p>

          {/* Role Selector */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map(r => {
                const Icon = r.icon
                const isSelected = role === r.value
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      isSelected ? r.selectedColor : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`text-xs font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                      {r.label}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {roles.find(r => r.value === role)?.desc}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input type="text" className="input" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input type="tel" className="input" placeholder="+91-XXXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>
              {role === 'doctor' && (
  <div className="space-y-4 border-t pt-4">
    <h3 className="font-semibold text-gray-800">
      Doctor Information
    </h3>

    <input
      type="text"
      className="input"
      placeholder="Specialization"
      value={specialization}
      onChange={(e) => setSpecialization(e.target.value)}
      required
    />

    <input
      type="text"
      className="input"
      placeholder="Department"
      value={department}
      onChange={(e) => setDepartment(e.target.value)}
      required
    />

    <input
      type="text"
      className="input"
      placeholder="Qualification"
      value={qualification}
      onChange={(e) => setQualification(e.target.value)}
      required
    />

    <input
      type="number"
      className="input"
      placeholder="Experience (Years)"
      value={experience}
      onChange={(e) => setExperience(e.target.value)}
      required
    />

    <input
      type="number"
      className="input"
      placeholder="Consultation Fee"
      value={fee}
      onChange={(e) => setFee(e.target.value)}
      required
    />

    <input
      type="number"
      className="input"
      placeholder="Hospital ID"
      value={hospitalId}
      onChange={(e) => setHospitalId(e.target.value)}
      required
    />

    <input
      type="text"
      className="input"
      placeholder="Profile Image URL"
      value={image}
      onChange={(e) => setImage(e.target.value)}
    />

    <textarea
      className="input min-h-[100px]"
      placeholder="Doctor Bio"
      value={bio}
      onChange={(e) => setBio(e.target.value)}
    />
  </div>
)}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><UserPlus className="w-4 h-4" /> Create Account</>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
