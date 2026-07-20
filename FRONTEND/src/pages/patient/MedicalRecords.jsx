import { useState, useEffect } from 'react'
import { FileText, Plus, X, Calendar, Tag, Loader } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getRecords, addRecord, deleteRecord } from '../../store/store.js'

const RECORD_TYPES = ['Lab Report', 'Prescription', 'Scan', 'X-Ray', 'Discharge Summary', 'General']

const typeBadge = {
  'Lab Report': 'badge-blue',
  'Prescription': 'badge-green',
  'Scan': 'badge-yellow',
  'X-Ray': 'badge-gray',
  'Discharge Summary': 'badge-red',
  'General': 'badge-gray',
}

export default function MedicalRecords() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [allRecords, setAllRecords] = useState([])
  const [filterType, setFilterType] = useState('')
  const [showForm, setShowForm] = useState(false)

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [recordType, setRecordType] = useState('General')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)

  // Fetch records from backend
  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return
      try {
        setLoading(true)
        const records = await getRecords(user.id)
        setAllRecords(records)
      } catch (e) {
        console.error('Failed to load records:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.id])

  const filtered = filterType ? allRecords.filter(r => r.type === filterType) : allRecords

  // ── Add a new record (async) ─────────────────────────────────────
  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)

    try {
      const newRecord = {
        patientId: user.id,
        title,
        description,
        type: recordType,
        date,
      }

      await addRecord(newRecord)

      // Refresh records
      const updated = await getRecords(user.id)
      setAllRecords(updated)

      // Reset form
      setTitle('')
      setDescription('')
      setRecordType('General')
      setShowForm(false)
    } catch (e) {
      console.error('Failed to save record:', e)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteRecord(id)
      const updated = await getRecords(user.id)
      setAllRecords(updated)
    } catch (e) {
      console.error('Failed to delete record:', e)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-500 text-sm mt-1">Your complete health history</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-4 py-2">
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterType('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${!filterType ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'
            }`}
        >
          All ({allRecords.length})
        </button>
        {RECORD_TYPES.map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterType === t ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
          >
            {t} ({allRecords.filter(r => r.type === t).length})
          </button>
        ))}
      </div>

      {/* ── Add Record Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Add Medical Record</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Blood Test Report"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Type *</label>
                  <select className="input" value={recordType} onChange={e => setRecordType(e.target.value)}>
                    {RECORD_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date *</label>
                  <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="Additional notes or findings…"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? <Loader className="w-4 h-4 animate-spin" /> : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Records List ── */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No records yet</p>
          <button onClick={() => setShowForm(true)} className="mt-3 btn-primary text-sm px-4 py-2 inline-flex">
            Add First Record
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(rec => (
            <div key={rec.id} className="card flex items-start gap-4 p-4 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={typeBadge[rec.type] || 'badge-gray'}>{rec.type}</span>
                    <button
                      onClick={() => handleDelete(rec.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {rec.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{rec.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /><p>
                      {new Date(rec.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {rec.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
