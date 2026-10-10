'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/admin/ImageUpload'
import FileUpload from '@/components/admin/FileUpload'
import { About } from '@/types'

export default function AdminAboutPage() {
  const router = useRouter()
  const [about, setAbout] = useState<About | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    profile_image_url: '',
    resume_url: '',
  })

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about')
      const data = await res.json()
      if (data) {
        setAbout(data)
        setFormData({
          title: data.title || '',
          description: data.description || '',
          profile_image_url: data.profile_image_url || '',
          resume_url: data.resume_url || '',
        })
      }
    } catch (error) {
      console.error('Error fetching about:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/about', {
        method: about ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Failed to save')

      toast.success('About section updated successfully!')
      fetchAbout()
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Failed to save about section')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
        <p className="mb-6 text-sm text-zinc-500">
          This is the bio, photo, and resume on the public site.
        </p>

        <form onSubmit={handleSubmit} className="admin-panel space-y-6 p-6">
          {/* Profile Image */}
          <div>
            <label className="admin-label">
              Profile Image
            </label>
            <ImageUpload
              currentImageUrl={formData.profile_image_url}
              onUploadComplete={(url) => setFormData({ ...formData, profile_image_url: url })}
              bucket="profile-images"
              label=""
            />
          </div>

          {/* Title */}
          <div>
            <label className="admin-label">
              Title / Role
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="admin-input"
              placeholder="e.g., Full Stack Developer"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="admin-label">
              Description / Bio
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={8}
              className="admin-input"
              placeholder="Write about yourself, your experience, skills, and what you're passionate about..."
              required
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="admin-label">
              Resume (PDF)
            </label>
            <FileUpload
              currentFileUrl={formData.resume_url}
              onUploadComplete={(url) => setFormData({ ...formData, resume_url: url })}
              accept=".pdf"
              maxSize={10}
              bucket="documents"
              label=""
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="admin-btn"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="admin-btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>
    </div>
  )
}
