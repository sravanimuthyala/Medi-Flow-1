import { useState, useEffect } from 'react'
import { FileText, Plus, X, Pill, Loader } from 'lucide-react'
import { getDoctorAppointments, getPrescriptions, addPrescription } from '../../store/store.js'
import { useAuth } from '../../context/AuthContext.jsx'

// Empty medication template
const emptyMed = () => ({ name: '', dosage: '', frequency: '', duration: '' })

export default function DoctorPrescriptions() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [appointmentId, setAppointmentId] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [meds, setMeds] = useState([emptyMed()])

  const [appointments, setAppointments] = useState([])
  const [prescriptions, setPrescriptions] = useState([])

  // Fetch data from backend
  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return
      try {
        setLoading(true)
        const [appts, prescs] = await Promise.all([
          getDoctorAppointments(user.id),
          getPrescriptions(),
        ])
        setAppointments(appts.filter(a => a.status === 'completed'))
        setPrescriptions(prescs)
      } catch (e) {
        console.error('Failed to load data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.id])

  // ── Medication helpers ────────────────────────────────────
  function addMed() { setMeds([...meds, emptyMed()]) }
  function removeMed(i) { setMeds(meds.filter((_, idx) => idx !== i)) }
  function updateMed(i, k, v) { setMeds(meds.map((m, idx) => idx === i ? { ...m, [k]: v } : m)) }

  // ── Save prescription (async) ──────────────────────────────
  async function handleSave(e) {
    e.preventDefault()
    const appt = appointments.find(a => a.id === Number(appointmentId))
    if (!appt) return

    setSaving(true)

    try {
       console.log({
    appointmentId,
    diagnosis,
    notes,
    meds
  });
      await addPrescription({
        appointmentId,
        patientId: appt.patientId,
        diagnosis,
        medications: meds.filter(m => m.name.trim()),
        notes,
      })

      // Refresh prescriptions
      const updated = await getPrescriptions()
      setPrescriptions(updated)

      // Reset form
      setAppointmentId('')
      setDiagnosis('')
      setNotes('')
      setMeds([emptyMed()])
      setShowForm(false)
    } catch (e) {
      console.error('Failed to save prescription:', e)
    } finally {
      setSaving(false)
    }
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-500 text-sm mt-1">Digital prescription management</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-4 py-2">
          <Plus className="w-4 h-4" /> New Prescription
        </button>
      </div>

      {/* ── New Prescription Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">New Prescription</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Select completed appointment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Appointment *
                </label>
                <select className="input" value={appointmentId} onChange={e => setAppointmentId(e.target.value)} required>
                  <option value="">Choose a completed appointment…</option>
                  {appointments.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.date} at {a.time} — Patient #{a.patientId?.slice(-6)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Diagnosis *</label>
                <input type="text" className="input" placeholder="Primary diagnosis" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} required />
              </div>

              {/* Medications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Medications</label>
                  <button type="button" onClick={addMed} className="text-xs text-teal-600 hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {meds.map((med, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-xl relative">
                      {i > 0 && (
                        <button type="button" onClick={() => removeMed(i)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2">
                          <input type="text" className="input text-xs" placeholder="Medicine name" value={med.name} onChange={e => updateMed(i, 'name', e.target.value)} />
                        </div>
                        <input type="text" className="input text-xs" placeholder="Dosage e.g. 500mg" value={med.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)} />
                        <input type="text" className="input text-xs" placeholder="Frequency 3x/day" value={med.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)} />
                        <div className="col-span-2">
                          <input type="text" className="input text-xs" placeholder="Duration e.g. 7 days" value={med.duration} onChange={e => updateMed(i, 'duration', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                <textarea className="input resize-none" rows={2} placeholder="Additional instructions…" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSave} type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-all disabled:opacity-50">
                  {saving ? <Loader className="w-4 h-4 animate-spin" /> : 'Save Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Prescriptions List ── */}
      {prescriptions.length === 0 ? (
        <div className="card text-center py-16">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No prescriptions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map(presc => (
            <div key={presc.id} className="card hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Patient #{presc.patientId?.slice(-6)}
                  </h3>
                  <p className="text-sm text-teal-600 font-medium">{presc.diagnosis}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(presc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="badge-blue">{presc.medications.length} medicine{presc.medications.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Medication list */}
              {presc.medications.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid sm:grid-cols-2 gap-2">
                  {presc.medications.map((m, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-teal-50 rounded-lg">
                      <Pill className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{m.name} — {m.dosage}</p>
                        <p className="text-xs text-gray-500">{m.frequency}, {m.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {presc.notes && (
                <p className="text-xs text-gray-400 mt-2 italic">Note: {presc.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}