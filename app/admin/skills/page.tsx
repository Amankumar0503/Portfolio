'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { numberField, numberOrZero } from '@/lib/utils'
import DataTable from '@/components/admin/DataTable'
import { useConfirm } from '@/components/admin/ConfirmDialog'
import { Skill } from '@/types'

export default function AdminSkillsPage() {
  const confirm = useConfirm()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 50 as number | '',
    display_order: 0 as number | '',
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills')
      const data = await res.json()
      setSkills(data)
    } catch (error) {
      console.error('Error fetching skills:', error)
      toast.error('Failed to load skills')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingSkill ? `/api/skills/${editingSkill.id}` : '/api/skills'
      const method = editingSkill ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          proficiency: numberOrZero(formData.proficiency),
          display_order: numberOrZero(formData.display_order),
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      toast.success(editingSkill ? 'Skill updated!' : 'Skill added!')
      resetForm()
      fetchSkills()
    } catch (error) {
      console.error('Error saving skill:', error)
      toast.error('Failed to save skill')
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      display_order: skill.display_order,
    })
  }

  const handleDelete = async (skill: Skill) => {
    const ok = await confirm({
      title: 'Delete skill',
      message: `Delete "${skill.name}"?`,
    })
    if (!ok) return

    try {
      const res = await fetch(`/api/skills/${skill.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')

      toast.success('Skill deleted!')
      fetchSkills()
    } catch (error) {
      console.error('Error deleting skill:', error)
      toast.error('Failed to delete skill')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', category: '', proficiency: 50, display_order: 0 })
    setEditingSkill(null)
  }

  const columns = [
    { key: 'name', label: 'Skill Name' },
    { key: 'category', label: 'Category' },
    { key: 'proficiency', label: 'Proficiency', render: (value: number) => `${value}%` },
    { key: 'display_order', label: 'Order' },
  ]

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">Skills shown on the about page.</p>

        <div className="admin-panel mb-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingSkill ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="admin-input"
                  placeholder="e.g., React"
                  required
                />
              </div>
              <div>
                <label className="admin-label">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="admin-input"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Tools">Tools</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="admin-label">
                  Proficiency (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: numberField(e.target.value) })}
                  className="admin-input"
                  required
                />
              </div>
              <div>
                <label className="admin-label">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: numberField(e.target.value) })}
                  className="admin-input"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="admin-btn"
              >
                {editingSkill ? 'Update' : 'Add'} Skill
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
        data={skills}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
