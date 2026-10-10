'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { numberField, numberOrZero } from '@/lib/utils'
import DataTable from '@/components/admin/DataTable'
import { useConfirm } from '@/components/admin/ConfirmDialog'
import { SocialLink } from '@/types'

export default function AdminSocialLinksPage() {
  const confirm = useConfirm()
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon: '',
    display_order: 0 as number | '',
    is_visible: true,
  })

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  const fetchSocialLinks = async () => {
    try {
      const res = await fetch('/api/social')
      const data = await res.json()
      setSocialLinks(data)
    } catch (error) {
      console.error('Error fetching social links:', error)
      toast.error('Failed to load social links')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingLink ? `/api/social/${editingLink.id}` : '/api/social'
      const method = editingLink ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          display_order: numberOrZero(formData.display_order),
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      toast.success(editingLink ? 'Social link updated!' : 'Social link added!')
      resetForm()
      fetchSocialLinks()
    } catch (error) {
      console.error('Error saving social link:', error)
      toast.error('Failed to save social link')
    }
  }

  const handleEdit = (link: SocialLink) => {
    setEditingLink(link)
    setFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
      display_order: link.display_order,
      is_visible: link.is_visible !== false,
    })
  }

  const handleDelete = async (link: SocialLink) => {
    const ok = await confirm({
      title: 'Delete social link',
      message: `Delete the ${link.platform} link?`,
    })
    if (!ok) return

    try {
      const res = await fetch(`/api/social/${link.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')

      toast.success('Social link deleted!')
      fetchSocialLinks()
    } catch (error) {
      console.error('Error deleting social link:', error)
      toast.error('Failed to delete social link')
    }
  }

  const resetForm = () => {
    setFormData({ platform: '', url: '', icon: '', display_order: 0, is_visible: true })
    setEditingLink(null)
  }

  const columns = [
    { key: 'platform', label: 'Platform' },
    { key: 'url', label: 'URL' },
    { key: 'icon', label: 'Icon' },
    { key: 'display_order', label: 'Order' },
  ]

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">Links shown in the site footer.</p>

        <div className="admin-panel mb-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingLink ? 'Edit Social Link' : 'Add New Social Link'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="admin-input"
                  required
                >
                  <option value="">Select Platform</option>
                  <option value="GitHub">GitHub</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Email">Email</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="admin-label">
                  Icon (Font Awesome name)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="admin-input"
                  placeholder="github, linkedin, twitter, email, or an emoji"
                  required
                />
              </div>
            </div>
            <div>
              <label className="admin-label">
                URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="admin-input"
                placeholder="https://github.com/yourusername"
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
            <div className="flex gap-4">
              <button
                type="submit"
                className="admin-btn"
              >
                {editingLink ? 'Update' : 'Add'} Social Link
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
        data={socialLinks}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
