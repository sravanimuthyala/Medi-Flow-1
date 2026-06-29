/**
 * EmergencyResources.jsx
 * -----------------------
 * Public page showing emergency resource availability at hospitals.
 * No login required - accessible to everyone for emergencies.
 */

import { useState } from 'react'
import { AlertTriangle, Phone, MapPin, Activity, Wind, Droplet, User, Check, X } from 'lucide-react'
import { hospitals, emergencyResources } from '../../data/mockData.js'

export default function EmergencyResources() {
  const [selectedHospital, setSelected] = useState('')
  const [bloodFilter, setBloodFilter] = useState('')

  // Filter hospitals
  const filtered = hospitals.filter(h =>
    !selectedHospital || h.id === selectedHospital
  )

  // Get emergency data for a hospital
  function getEmergencyData(hospitalId) {
    return emergencyResources.find(e => e.hospitalId === hospitalId)
  }

  // Check if blood type is available
  function bloodAvailable(data, type) {
    return data && data.blood[type] > 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with emergency banner */}
      <div className="bg-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Emergency Resources</h1>
          </div>
          <p className="text-red-100 text-sm">
            Real-time availability of ICU beds, ventilators & blood bank. No login required.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-3 flex-wrap">
          <select
            className="input w-auto"
            value={selectedHospital}
            onChange={e => setSelected(e.target.value)}
          >
            <option value="">All Hospitals</option>
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
          <select
            className="input w-auto"
            value={bloodFilter}
            onChange={e => setBloodFilter(e.target.value)}
          >
            <option value="">All Blood Types</option>
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hospital cards */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map(hospital => {
            const data = getEmergencyData(hospital.id)
            if (!data) return null

            return (
              <div key={hospital.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Hospital header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <img
                      src={hospital.image}
                      alt={hospital.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-gray-900">{hospital.name}</h2>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {hospital.address}
                      </p>
                      <a
                        href={`tel:${hospital.phone}`}
                        className="text-sm text-red-600 font-medium flex items-center gap-1 mt-1 hover:underline"
                      >
                        <Phone className="w-3 h-3" /> {hospital.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Resource availability */}
                <div className="p-4 space-y-4">
                  {/* ICU & Ventilator row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* ICU Beds */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                        <Activity className="w-3.5 h-3.5" />
                        ICU Beds
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {data.icuAvailable}/{data.icuTotal}
                      </div>
                      <div className="text-xs text-gray-500">available</div>
                      {data.icuAvailable <= 2 && (
                        <span className="text-xs text-red-600 font-medium">Critical</span>
                      )}
                    </div>

                    {/* Ventilators */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                        <Wind className="w-3.5 h-3.5" />
                        Ventilators
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {data.ventAvailable}/{data.ventTotal}
                      </div>
                      <div className="text-xs text-gray-500">available</div>
                      {data.ventAvailable === 0 && (
                        <span className="text-xs text-red-600 font-medium">None available</span>
                      )}
                    </div>
                  </div>

                  {/* Emergency doctors */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <User className="w-4 h-4" />
                      Emergency Doctors
                    </div>
                    <span className="font-bold text-gray-900">{data.emergencyDocs} on duty</span>
                  </div>

                  {/* Anesthesia availability */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-600">Anesthesia Available</span>
                    {data.anesthesia ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <Check className="w-4 h-4" /> Yes
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                        <X className="w-4 h-4" /> No
                      </span>
                    )}
                  </div>

                  {/* Blood bank */}
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <Droplet className="w-4 h-4 text-red-500" />
                      Blood Bank
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(data.blood)
                        .filter(([type]) => !bloodFilter || type === bloodFilter)
                        .map(([type, count]) => (
                          <div
                            key={type}
                            className={`text-center p-2 rounded-lg ${
                              count > 0 ? 'bg-green-50' : 'bg-red-50'
                            }`}
                          >
                            <div className={`text-xs font-medium ${count > 0 ? 'text-green-700' : 'text-red-700'}`}>
                              {type}
                            </div>
                            <div className={`text-lg font-bold ${count > 0 ? 'text-green-800' : 'text-red-600'}`}>
                              {count}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Call button */}
                <div className="px-4 pb-4">
                  <a
                    href={`tel:${hospital.phone}`}
                    className="block w-full text-center py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    Call Emergency
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No hospitals match your filters
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <strong>Note:</strong> This is a demo page. In a real hospital system, this data would be
          updated in real-time by hospital staff. Always call the hospital directly to confirm
          availability before transferring a patient.
        </div>
      </div>
    </div>
  )
}