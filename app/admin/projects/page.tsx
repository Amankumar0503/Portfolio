'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import DataTable from '@/components/admin/DataTable'
import ImageUpload from '@/components/admin/ImageUpload'
import { useConfirm } from '@/components/admin/ConfirmDialog'
import { Project } from '@/types'
import { numberField, numberOrZero } from '@/lib/utils'

const emptyForm = {
  title: '',
  short_description: '',
  long_description: '',
  technologies: '',
  github_url: '',
  demo_url: '',
  image_url: '',
  is_featured: false,
  display_order: 0 as number | '',
}

export default function AdminProjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const confirm = useConfirm()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    const id = searchParams.get('edit')
    if (!id) return

    fetch(`/api/projects/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((project: Project | null) => {
        if (project) fillForm(project)
      })
      .catch(() => toast.error('Failed to load project'))
  }, [searchParams])

  const fetchProjects = () => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching projects:', error)
        setLoading(false)
      })
  }

  const fillForm = (project: Project) => {
    setEditing(project)
    setFormData({
      title: project.title,
      short_description: project.short_description,
      long_description: project.long_description || '',
      technologies: project.technologies.join(', '),
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
      image_url: project.image_url || '',
      is_featured: project.is_featured,
      display_order: project.display_order,
    })
  }

  const resetForm = () => {
    setEditing(null)
    setFormData(emptyForm)
    if (searchParams.get('edit')) {
      router.replace('/admin/projects')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        display_order: numberOrZero(formData.display_order),
      }
      const response = await fetch(
        editing ? `/api/projects/${editing.id}` : '/api/projects',
        {
          method: editing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || 'Failed to save project')
        return
      }

      toast.success(editing ? 'Project updated' : 'Project added')
      resetForm()
      fetchProjects()
    } catch (error) {
      console.error('Save error:', error)
      toast.error('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (project: Project) => {
    const ok = await confirm({
      title: 'Delete project',
      message: `Delete "${project.title}"? This cannot be undone.`,
    })
    if (!ok) return

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Project deleted')
        if (editing?.id === project.id) resetForm()
        fetchProjects()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete project')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('An error occurred')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: string, row: Project) => (
        <div>
          <div className="font-medium">{value}</div>
          {row.is_featured && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'short_description',
      label: 'Description',
      render: (value: string) => <div className="max-w-xs truncate">{value}</div>,
    },
    {
      key: 'technologies',
      label: 'Technologies',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {(value || []).slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full"
            >
              {tech}
            </span>
          ))}
          {value?.length > 3 && (
            <span className="text-xs text-gray-500">+{value.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">Work shown on the public projects page.</p>

      <div className="admin-panel p-6">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          {editing ? 'Edit project' : 'Add project'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="admin-label">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="admin-input"
                placeholder="e.g., Mentorship Platform"
              />
            </div>
            <div>
              <label className="admin-label">Short description</label>
              <input
                type="text"
                required
                value={formData.short_description}
                onChange={(e) =>
                  setFormData({ ...formData, short_description: e.target.value })
                }
                className="admin-input"
                placeholder="A brief one-line description"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Full description</label>
            <textarea
              required
              rows={5}
              value={formData.long_description}
              onChange={(e) =>
                setFormData({ ...formData, long_description: e.target.value })
              }
              className="admin-input"
              placeholder="What the project does and what you built"
            />
          </div>

          <div>
            <label className="admin-label">Technologies, comma-separated</label>
            <input
              type="text"
              required
              value={formData.technologies}
              onChange={(e) =>
                setFormData({ ...formData, technologies: e.target.value })
              }
              className="admin-input"
              placeholder="React, Node.js, TypeScript"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="admin-label">GitHub URL</label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) =>
                  setFormData({ ...formData, github_url: e.target.value })
                }
                className="admin-input"
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div>
              <label className="admin-label">Live demo URL</label>
              <input
                type="url"
                value={formData.demo_url}
                onChange={(e) =>
                  setFormData({ ...formData, demo_url: e.target.value })
                }
                className="admin-input"
                placeholder="https://your-project.vercel.app"
              />
            </div>
            <div>
              <label className="admin-label">Display order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: numberField(e.target.value),
                  })
                }
                className="admin-input"
              />
            </div>
            <div className="flex items-end">
              <label className="mb-2 flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData({ ...formData, is_featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded"
                />
                Featured on the home page
              </label>
            </div>
          </div>

          <div>
            <label className="admin-label">Project image</label>
            <ImageUpload
              currentImageUrl={formData.image_url}
              onUploadComplete={(url) =>
                setFormData({ ...formData, image_url: url })
              }
              label=""
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="admin-btn">
              {saving ? 'Saving...' : editing ? 'Update project' : 'Add project'}
            </button>
            {editing && (
              <button type="button" onClick={resetForm} className="admin-btn-ghost">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        loading={loading}
        emptyLabel="No projects yet."
        searchPlaceholder="Search projects"
        onEdit={fillForm}
        onDelete={handleDelete}
      />
    </div>
  )
}
