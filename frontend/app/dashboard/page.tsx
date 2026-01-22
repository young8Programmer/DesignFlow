'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import Link from 'next/link'
import { Plus, FileText, LogOut } from 'lucide-react'

interface Design {
  id: string
  name: string
  thumbnail: string | null
  updatedAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuthStore()
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    fetchDesigns()
  }, [isAuthenticated, router])

  const fetchDesigns = async () => {
    try {
      const response = await api.get('/designs')
      setDesigns(response.data)
    } catch (error) {
      console.error('Failed to fetch designs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

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
              <h1 className="text-2xl font-bold text-primary-600">DesignFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.firstName} {user?.lastName}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Designs</h2>
          <Link
            href="/editor"
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Design</span>
          </Link>
        </div>

        {designs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No designs</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new design.</p>
            <div className="mt-6">
              <Link
                href="/editor"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Design
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {designs.map((design) => (
              <Link
                key={design.id}
                href={`/editor/${design.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
              >
                {design.thumbnail ? (
                  <img
                    src={design.thumbnail}
                    alt={design.name}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded mb-3 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <h3 className="font-medium text-gray-900 truncate">{design.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(design.updatedAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
