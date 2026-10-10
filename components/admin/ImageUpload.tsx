'use client'

import { useEffect, useState, useRef } from 'react'
import { uploadFile } from '@/lib/api'
import { formatFileSize } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  currentImageUrl?: string
  onUploadSuccess?: (url: string) => void
  onUploadComplete?: (url: string) => void
  bucket?: string
  label?: string
}

export default function ImageUpload({
  currentImageUrl,
  onUploadSuccess,
  onUploadComplete,
  bucket = 'project-images',
  label = 'Upload Image',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(currentImageUrl || null)
  }, [currentImageUrl])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setUploading(true)
    try {
      const result = await uploadFile('/upload/image', file)
      if (result.data) {
        toast.success('Image uploaded successfully')
        onUploadSuccess?.(result.data.url)
        onUploadComplete?.(result.data.url)
      } else {
        toast.error(result.error || 'Upload failed')
        setPreview(currentImageUrl || null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('An error occurred during upload')
      setPreview(currentImageUrl || null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {label ? <label className="admin-label">{label}</label> : null}

      <div className="flex flex-col items-center">
        {preview && (
          <div className="mb-4 relative w-full max-w-md h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="admin-btn"
        >
          {uploading ? 'Uploading...' : preview ? 'Change Image' : 'Select Image'}
        </button>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          PNG, JPG, or WebP. Max 5MB.
        </p>
      </div>
    </div>
  )
}
