'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SocialLink } from '@/types'
import SocialIcon from '@/components/public/SocialIcon'

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    fetch('/api/social')
      .then((res) => res.json())
      .then((data) => setSocialLinks(data))
      .catch((error) => console.error('Error fetching social links:', error))
  }, [])

  return (
    <footer className="relative gradient-animated backdrop-blur-xl shadow-2xl mt-20">
      {/* Subtle gradient overlay for better glass effect */}
      <div className="absolute inset-0 glass glass-noise border-t border-white/10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-4 drop-shadow-lg">
              Portfolio
            </h3>
            <p className="text-gray-800 dark:text-white/90 leading-relaxed">
              Full Stack Developer passionate about creating beautiful and functional web applications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/projects', label: 'Projects' },
                { href: '/experience', label: 'Experience' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400/0 group-hover:bg-blue-400 transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Connect
            </h4>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-xl glass-strong glass-hover text-gray-800 dark:text-white/90 hover:text-gray-900 dark:hover:text-white transition-all group shadow-lg"
                  aria-label={social.platform}
                >
                  <span className="group-hover:scale-110 transition-transform">
                    <SocialIcon name={social.icon || social.platform} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-center text-gray-700 dark:text-white/80 flex items-center justify-center gap-2">
            <span className="text-blue-600 dark:text-blue-400">©</span>
            {currentYear} Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
