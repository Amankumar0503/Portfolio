'use client'

import { useEffect, useState } from 'react'
import { Skill } from '@/types'

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => {
        setSkills(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching skills:', error)
        setLoading(false)
      })
  }, [])

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (loading) {
    return (
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass glass-noise rounded-3xl p-12 animate-pulse">
            <div className="h-10 glass-strong rounded-xl w-1/4 mx-auto mb-12"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 glass rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
          Skills & Technologies
        </h2>
        
        <div className="space-y-12">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="glass glass-noise rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white/90 mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></span>
                {category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="glass-strong glass-hover rounded-xl p-6 shadow-lg group transition-all"
                  >
                    <div className="text-center">
                      {skill.icon_url && (
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                          {skill.icon_url}
                        </div>
                      )}
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        {skill.name}
                      </h4>
                      <div className="relative w-full glass rounded-full h-2.5 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                        <div
                          className="skill-bar relative bg-gradient-to-r from-blue-400 to-purple-400 h-2.5 rounded-full shadow-lg shadow-blue-500/50"
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-white/70 mt-2 font-medium">
                        {skill.proficiency}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
