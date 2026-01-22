'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import CanvasEditor from '@/components/Editor/CanvasEditor'
import Toolbar from '@/components/Editor/Toolbar'
import PropertiesPanel from '@/components/Editor/PropertiesPanel'
import LayersPanel from '@/components/Editor/LayersPanel'
import api from '@/lib/api'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function EditDesignPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated } = useAuthStore()
  const [canvasData, setCanvasData] = useState<any>(null)
  const [designName, setDesignName] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    fetchDesign()
  }, [isAuthenticated, params.id])

  const fetchDesign = async () => {
    try {
      const response = await api.get(`/designs/${params.id}`)
      setDesignName(response.data.name)
      setCanvasData(response.data.canvasData)
    } catch (error: any) {
      toast.error('Failed to load design')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!canvasData) return

    setSaving(true)
    try {
      await api.patch(`/designs/${params.id}`, {
        name: designName,
        canvasData,
      })
      toast.success('Design saved!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save design')
    } finally {
      setSaving(false)
    }
  }

  const handleCanvasChange = (data: any) => {
    setCanvasData(data)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
          <input
            type="text"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 px-2 py-1 rounded hover:bg-gray-100"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Saving...' : 'Save'}</span>
        </button>
      </div>

      {/* Toolbar */}
      <Toolbar />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Layers Panel */}
        <LayersPanel />

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <CanvasEditor
            width={800}
            height={600}
            canvasData={canvasData}
            onSave={handleCanvasChange}
          />
        </div>

        {/* Properties Panel */}
        <PropertiesPanel />
      </div>
    </div>
  )
}
