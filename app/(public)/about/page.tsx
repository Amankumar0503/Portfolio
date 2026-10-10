'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import CodeBackground from '@/components/public/CodeBackground'
import { About, Skill } from '@/types'

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const previous = history.scrollRestoration
    history.scrollRestoration = 'manual'
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    Promise.all([
      fetch('/api/about').then((res) => res.json()),
      fetch('/api/skills').then((res) => res.json()),
    ])
      .then(([aboutData, skillsData]) => {
        setAbout(aboutData)
        setSkills(skillsData)
        setLoading(false)
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setLoading(false)
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      })

    return () => {
      history.scrollRestoration = previous
    }
  }, [])

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (loading) {
    return (
      <div className="relative overflow-hidden [overflow-anchor:none]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="animate-pulse glass glass-noise rounded-3xl p-12">
            <div className="h-12 glass-strong rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 glass rounded"></div>
              <div className="h-4 glass rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden [overflow-anchor:none]">
      {/* Code Animation Background */}
      <CodeBackground />
      
      {/* Floating orbs for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
          {about?.title || 'About Me'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2 glass glass-noise rounded-3xl p-12 shadow-2xl">
            <p className="text-lg text-gray-800 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {about?.description}
            </p>
          </div>

          <div className="space-y-6">
            {about?.profile_image_url && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative h-80 rounded-2xl overflow-hidden glass border border-gray-900/20 dark:border-white/20 shadow-2xl">
                  <img
                    src={about.profile_image_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {about?.resume_url && (
              <a
                href={about.resume_url}
                download
                className="flex items-center justify-center gap-2 w-full glass-strong glass-hover rounded-xl px-6 py-4 text-gray-900 dark:text-white text-center font-medium shadow-lg group transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </a>
            )}
          </div>
        </div>

      {/* Skills Section */}
      <div className="mt-20">
        <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
          Skills & Expertise
        </h2>

        <div className="space-y-12">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="glass glass-noise rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></span>
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="glass-strong glass-hover rounded-xl p-6 shadow-lg group transition-all"
                  >
                    <div className="flex items-center mb-3">
                      {skill.icon_url && (
                        <span className="text-3xl mr-3 group-hover:scale-110 transition-transform">{skill.icon_url}</span>
                      )}
                      <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                        {skill.name}
                      </h4>
                    </div>
                    <div className="w-full glass rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all shadow-lg shadow-blue-500/50"
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-400 mt-2 text-right font-medium">
                      {skill.proficiency}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}
