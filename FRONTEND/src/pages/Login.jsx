import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { signIn, signOut } = useAuth()
  const navigate = useNavigate()

  // ── Form state ───────────────────────────────────────────
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false);
  const [deactivateDialog, setDeactivateDialog] = useState(false);
  // ── Handle form submit (async) ─────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (
      result.user.role === "doctor" &&
      result.user.onboarding_status === "pending"
    ) {
      setShowDialog(true);
      setLoading(false);
      return;
    }

    if (
      result.user.role === "doctor" &&
      result.user.active === false
    ) {
      setDeactivateDialog(true);
      setLoading(false);
      return;
    }

    navigate("/dashboard");

    setLoading(false);
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-slide-up">

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
            <p className="text-gray-400 text-sm">Smart Healthcare Platform</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm mb-6">Sign in to your MediFlow account</p>

            {/* Error message */}
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pr-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  {/* Toggle show/hide password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><LogIn className="w-4 h-4" /> Sign In</>
                }
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">Create one</Link>
            </p>
          </div>

          {/* Backend setup hint */}

        </div>
      </div>{showDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-8 animate-fade-in">

            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mt-6">
              Onboarding Pending
            </h2>

            <p className="text-center text-gray-500 mt-4 leading-7">
              Your doctor account has not yet been approved by the administrator.
            </p>

            <p className="text-center text-gray-500 leading-7">
              Please contact the administrator and wait until your onboarding is completed.
            </p>

            <button
              onClick={async () => {
                setShowDialog(false);
                await signOut();
                navigate("/login", { replace: true });
              }}
              className="mt-8 w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
            >
              OK
            </button>

          </div>

        </div>
      )}
      {deactivateDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-8 animate-fade-in">

            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mt-6">
              Account Deactivated
            </h2>

            <p className="text-center text-gray-500 mt-4 leading-7">
              Your account has been <span className="font-semibold text-red-600">deactivated</span> by the administrator.
            </p>

            <p className="text-center text-gray-500 leading-7">
              Please contact the administrator to reactivate your account.
            </p>

            <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">Admin Contact</p>
              <p className="text-lg font-semibold text-blue-600">
                +91 9876543210
              </p>
            </div>

            <button
              onClick={async () => {
                setDeactivateDialog(false);
                await signOut();
                navigate("/login", { replace: true });
              }}
              className="mt-8 w-full h-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
            >
              OK
            </button>

          </div>

        </div>
      )}</>
  )
}
