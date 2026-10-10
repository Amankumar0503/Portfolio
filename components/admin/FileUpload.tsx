'use client'

import { useState, useRef } from 'react'
import { uploadFile } from '@/lib/api'
import { formatFileSize } from '@/lib/utils'
import toast from 'react-hot-toast'

interface FileUploadProps {
  currentFileUrl?: string
  onUploadSuccess?: (url: string) => void
  onUploadComplete?: (url: string) => void
  label?: string
  endpoint?: 'resume' | 'document'
  accept?: string
  maxSize?: number
  bucket?: string
}

export default function FileUpload({
  currentFileUrl,
  onUploadSuccess,
  onUploadComplete,
  label = 'Upload File',
  endpoint = 'document',
  accept = '.pdf',
  maxSize = 10,
  bucket,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(
    currentFileUrl ? currentFileUrl.split('/').pop() || null : null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file')
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setFileName(file.name)

    // Upload
    setUploading(true)
    try {
      const result = await uploadFile(`/upload/${endpoint}`, file)
      if (result.data) {
        toast.success('File uploaded successfully')
        onUploadSuccess?.(result.data.url)
        onUploadComplete?.(result.data.url)
      } else {
        toast.error(result.error || 'Upload failed')
        setFileName(currentFileUrl ? currentFileUrl.split('/').pop() || null : null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('An error occurred during upload')
      setFileName(currentFileUrl ? currentFileUrl.split('/').pop() || null : null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {label ? <label className="admin-label">{label}</label> : null}

      <div className="flex flex-col items-start">
        {fileName && (
          <div className="mb-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg w-full">
            <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
              📄 {fileName}
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="admin-btn"
        >
          {uploading ? 'Uploading...' : fileName ? 'Change File' : 'Select PDF'}
        </button>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          PDF only. Max 10MB.
        </p>
      </div>
    </div>
  )
}
