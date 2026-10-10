'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DataTable from '@/components/admin/DataTable'
import { useConfirm } from '@/components/admin/ConfirmDialog'
import { Experience } from '@/types'

export default function AdminExperiencePage() {
  const confirm = useConfirm()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experience')
      const data = await res.json()
      setExperiences(data)
    } catch (error) {
      console.error('Error fetching experiences:', error)
      toast.error('Failed to load experiences')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingExp ? `/api/experience/${editingExp.id}` : '/api/experience'
      const method = editingExp ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Failed to save')

      toast.success(editingExp ? 'Experience updated!' : 'Experience added!')
      resetForm()
      fetchExperiences()
    } catch (error) {
      console.error('Error saving experience:', error)
      toast.error('Failed to save experience')
    }
  }

  const handleEdit = (exp: Experience) => {
    setEditingExp(exp)
    setFormData({
      company: exp.company,
      position: exp.position,
      description: exp.description,
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current,
    })
  }

  const handleDelete = async (experience: Experience) => {
    const ok = await confirm({
      title: 'Delete experience',
      message: `Delete ${experience.position} at ${experience.company}?`,
    })
    if (!ok) return

    try {
      const res = await fetch(`/api/experience/${experience.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')

      toast.success('Experience deleted!')
      fetchExperiences()
    } catch (error) {
      console.error('Error deleting experience:', error)
      toast.error('Failed to delete experience')
    }
  }

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      description: '',
      start_date: '',
      end_date: '',
      is_current: false,
    })
    setEditingExp(null)
  }

  const columns = [
    { key: 'company', label: 'Company' },
    { key: 'position', label: 'Position' },
    { key: 'start_date', label: 'Start Date' },
    { 
      key: 'end_date', 
      label: 'End Date',
      render: (value: string | null, row: Experience) => row.is_current ? 'Present' : value || 'N/A'
    },
  ]

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">Roles on the public timeline.</p>

        <div className="admin-panel mb-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingExp ? 'Edit Experience' : 'Add New Experience'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="admin-input"
                  placeholder="e.g., Google"
                  required
                />
              </div>
              <div>
                <label className="admin-label">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="admin-input"
                  placeholder="e.g., Senior Developer"
                  required
                />
              </div>
            </div>
            <div>
              <label className="admin-label">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="admin-input"
                placeholder="Describe your responsibilities and achievements..."
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div>
                <label className="admin-label">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="admin-input"
                  disabled={formData.is_current}
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="current"
                checked={formData.is_current}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked, end_date: '' })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="current" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                I currently work here
              </label>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="admin-btn"
              >
                {editingExp ? 'Update' : 'Add'} Experience
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="admin-btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

      <DataTable
        data={experiences}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
