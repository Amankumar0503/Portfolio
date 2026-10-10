'use client'

import { useEffect, useState } from 'react'
import ProjectGrid from '@/components/public/ProjectGrid'
import CodeBackground from '@/components/public/CodeBackground'
import { Project } from '@/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTech, setSelectedTech] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data)
        setFilteredProjects(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching projects:', error)
        setLoading(false)
      })
  }, [])

  const allTechnologies = Object.entries(
    projects.reduce<Record<string, number>>((counts, project) => {
      for (const tech of project.technologies ?? []) {
        counts[tech] = (counts[tech] ?? 0) + 1
      }
      return counts
    }, {})
  )
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tech]) => tech)

  const filterProjects = (tech: string, search: string) => {
    let filtered = projects

    // Filter by technology
    if (tech !== 'all') {
      filtered = filtered.filter((p) =>
        p.technologies.some(t => t.toLowerCase() === tech.toLowerCase())
      )
    }

    // Filter by search query
    if (search.trim()) {
      const query = search.toLowerCase()
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(query) ||
        p.short_description.toLowerCase().includes(query) ||
        p.technologies.some(t => t.toLowerCase().includes(query))
      )
    }

    setFilteredProjects(filtered)
  }

  const handleFilterChange = (tech: string) => {
    setSelectedTech(tech)
    filterProjects(tech, searchQuery)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    filterProjects(selectedTech, query)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Code Animation Background */}
      <CodeBackground />
      
      {/* Floating orbs for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
            My Projects
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Explore my portfolio of web development projects
          </p>
        </div>

        {/* Search Bar and Clear Filters */}
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search projects by name or technology..."
                className="w-full px-6 py-4 pl-14 glass glass-noise rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              />
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    filterProjects(selectedTech, '')
                  }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSelectedTech('all')
                setSearchQuery('')
                setFilteredProjects(projects)
              }}
              disabled={selectedTech === 'all' && !searchQuery}
              className={`px-6 py-4 rounded-2xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                selectedTech !== 'all' || searchQuery
                  ? 'glass glass-noise text-red-600 dark:text-red-400 hover:glass-strong hover:bg-red-500/20 cursor-pointer'
                  : 'glass opacity-40 text-gray-500 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Filter */}
        {allTechnologies.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-2 justify-center items-center">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedTech === 'all'
                    ? 'glass-strong text-blue-600 dark:text-blue-300 shadow-lg'
                    : 'glass text-gray-800 dark:text-gray-300 hover:glass-strong'
                }`}
              >
                All
              </button>
              {allTechnologies.slice(0, 5).map((tech) => (
                <button
                  key={tech}
                  onClick={() => handleFilterChange(tech)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedTech === tech
                      ? 'glass-strong text-blue-600 dark:text-blue-300 shadow-lg'
                      : 'glass text-gray-800 dark:text-gray-300 hover:glass-strong'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse glass glass-noise rounded-2xl p-6">
                <div className="glass-strong h-48 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-6 glass-strong rounded"></div>
                  <div className="h-4 glass rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProjectGrid projects={filteredProjects} />
        )}
      </div>
    </div>
  )
}
