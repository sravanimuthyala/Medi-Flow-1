import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, MapPin, Clock, ChevronRight, Filter, Loader } from 'lucide-react'
import { getDoctors, getHospitals } from '../../store/store.js'

export default function FindDoctors() {
  const [doctors, setDoctors] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [filterHospital, setFilterHospital] = useState('')
  const [filterSpec, setFilterSpec] = useState('')

  // Fetch doctors and hospitals from backend on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [doctorsData, hospitalsData] = await Promise.all([
          getDoctors(),
          getHospitals(),
        ])
        setDoctors(doctorsData)
        setHospitals(hospitalsData)
      } catch (e) {
        setError('Failed to load doctors. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Get unique specializations for the dropdown
  const specializations = [...new Set(doctors.map(d => d.specialization))]

  // Filter doctors based on search inputs
  const filtered = doctors.filter(doc => {
    const matchSearch   = !search || doc.name.toLowerCase().includes(search.toLowerCase()) || doc.specialization.toLowerCase().includes(search.toLowerCase())
    const matchHospital = !filterHospital || doc.hospitalId === filterHospital
    const matchSpec     = !filterSpec || doc.specialization === filterSpec
    return matchSearch && matchHospital && matchSpec
  })

  // Clear all filters
  function clearFilters() {
    setSearch('')
    setFilterHospital('')
    setFilterSpec('')
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
        <p className="text-gray-500 text-sm mt-1">Browse our network of verified healthcare specialists</p>
      </div>

      {/* ── Search & Filters ── */}
      <div className="card p-4">
        <div className="grid sm:grid-cols-3 gap-3">
          {/* Text search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="input pl-9"
              placeholder="Search name or specialty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Hospital filter */}
          <select className="input" value={filterHospital} onChange={e => setFilterHospital(e.target.value)}>
            <option value="">All Hospitals</option>
            {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>

          {/* Specialization filter */}
          <select className="input" value={filterSpec} onChange={e => setFilterSpec(e.target.value)}>
            <option value="">All Specializations</option>
            {specializations.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Filter count + clear */}
        {(search || filterHospital || filterSpec) && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{filtered.length}</span> doctor{filtered.length !== 1 ? 's' : ''} found
            </p>
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              <Filter className="w-3 h-3" /> Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Doctor Cards ── */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No doctors match your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(doc => {
            // Find which hospital this doctor belongs to
            const hosp = hospitals.find(h => h.id === doc.hospitalId)

            return (
              <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col overflow-hidden">

                {/* Top section */}
                <div className="p-5 flex items-start gap-4">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 truncate">{doc.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{doc.specialization}</p>
                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-gray-700">{doc.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="px-5 pb-4 flex-1 space-y-1.5">
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {hosp?.name}, {hosp?.city}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    {doc.experience} years experience
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2">{doc.qualification}</p>
                </div>

                {/* Footer */}
                <div className="px-5 pb-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-lg font-bold text-gray-900">₹{doc.fee}</span>
                    <span className="text-xs text-gray-400 ml-1">/ visit</span>
                  </div>
                  <Link
                    to={`/patient/book/${doc.id}`}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Book <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
