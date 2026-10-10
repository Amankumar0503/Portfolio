'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const id = params.id
    router.replace(id ? `/admin/projects?edit=${id}` : '/admin/projects')
  }, [params.id, router])

  return null
}
