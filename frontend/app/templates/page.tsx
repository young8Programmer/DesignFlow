'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import Link from 'next/link'
import { FileText, Lock } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
  category: string
  isPremium: boolean
  isAccessible: boolean
}

export default function TemplatesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    fetchTemplates()
  }, [selectedCategory])

  const fetchTemplates = async () => {
    try {
      const url = selectedCategory
        ? `/templates?category=${selectedCategory}`
        : '/templates'
      const response = await api.get(url)
      setTemplates(response.data)
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = async (templateId: string, isPremium: boolean) => {
    if (isPremium && !isAuthenticated) {
      router.push('/auth/login')
      return
    }

    try {
      const response = await api.get(`/templates/${templateId}`)
      const template = response.data

      // Create a new design from template
      const designResponse = await api.post('/designs', {
        name: `${template.name} - Copy`,
        canvasData: template.canvasData,
        width: template.width,
        height: template.height,
        templateId: template.id,
      })

      router.push(`/editor/${designResponse.data.id}`)
    } catch (error: any) {
      console.error('Failed to use template:', error)
    }
  }

  const categories = [
    { value: '', label: 'All' },
    { value: 'resume', label: 'Resume' },
    { value: 'business_card', label: 'Business Card' },
    { value: 'instagram_post', label: 'Instagram Post' },
    { value: 'invitation', label: 'Invitation' },
    { value: 'menu', label: 'Menu' },
    { value: 'flyer', label: 'Flyer' },
    { value: 'poster', label: 'Poster' },
    { value: 'logo', label: 'Logo' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
                DesignFlow
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Templates</h1>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="relative">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                {template.isPremium && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Premium</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {template.description}
                </p>
                <button
                  onClick={() => handleUseTemplate(template.id, template.isPremium)}
                  disabled={template.isPremium && !template.isAccessible}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    template.isPremium && !template.isAccessible
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {template.isPremium && !template.isAccessible
                    ? 'Premium Required'
                    : 'Use Template'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
          </div>
        )}
      </main>
    </div>
  )
}
