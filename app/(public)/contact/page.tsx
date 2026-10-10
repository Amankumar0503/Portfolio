'use client'

import { useEffect, useState } from 'react'
import ContactForm from '@/components/public/ContactForm'
import CodeBackground from '@/components/public/CodeBackground'
import { SocialLink } from '@/types'
import SocialIcon from '@/components/public/SocialIcon'

export default function ContactPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

  useEffect(() => {
    fetch('/api/social')
      .then((res) => res.json())
      .then((data) => setSocialLinks(data))
      .catch((error) => console.error('Error fetching social links:', error))
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Code Animation Background */}
      <CodeBackground />
      
      {/* Floating orbs for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-400/30 dark:bg-pink-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Have a question or want to work together? Drop me a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form - Glass Panel */}
          <div className="glass glass-noise rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send Me a Message
            </h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass glass-noise rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Connect With Me
              </h2>
              
              <p className="text-gray-800 dark:text-gray-300 mb-6 leading-relaxed">
                I'm always interested in hearing about new projects and opportunities.
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>

              {socialLinks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Follow Me
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 glass-strong glass-hover rounded-xl px-4 py-3 transition-all group"
                      >
                        <span className="group-hover:scale-110 transition-transform">
                          <SocialIcon name={social.icon || social.platform} />
                        </span>
                        <span className="text-gray-800 dark:text-gray-300 font-medium">
                          {social.platform}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="glass glass-noise rounded-3xl p-8 shadow-2xl border border-blue-500/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Response Time
              </h3>
              <p className="text-gray-800 dark:text-gray-300 leading-relaxed">
                I typically respond to messages within 24-48 hours. Looking forward to hearing from you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
