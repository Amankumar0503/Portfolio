'use client'

import { Suspense, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import UnauthorizedNotice from '@/components/public/UnauthorizedNotice'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="min-h-screen gradient-animated relative">
      <div className="relative z-10">
        <Header />
        <Suspense fallback={null}>
          <UnauthorizedNotice />
        </Suspense>
        <main className="relative">
          {children}
        </main>
        <Footer />
      </div>
      <Toaster position="bottom-right" />
    </div>
  )
}
