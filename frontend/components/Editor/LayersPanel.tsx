'use client'

import { useEffect, useState } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import { fabric } from 'fabric'
import { Eye, EyeOff, Trash2 } from 'lucide-react'

export default function LayersPanel() {
  const { canvas, selectedObject, setSelectedObject } = useCanvasStore()
  const [layers, setLayers] = useState<fabric.Object[]>([])

  useEffect(() => {
    if (!canvas) return

    const updateLayers = () => {
      setLayers([...canvas.getObjects()].reverse())
    }

    updateLayers()

    canvas.on('object:added', updateLayers)
    canvas.on('object:removed', updateLayers)
    canvas.on('object:modified', updateLayers)

    return () => {
      canvas.off('object:added', updateLayers)
      canvas.off('object:removed', updateLayers)
      canvas.off('object:modified', updateLayers)
    }
  }, [canvas])

  const toggleVisibility = (obj: fabric.Object) => {
    if (!canvas) return

    obj.visible = !obj.visible
    canvas.renderAll()
    setLayers([...canvas.getObjects()].reverse())
  }

  const deleteLayer = (obj: fabric.Object) => {
    if (!canvas) return

    canvas.remove(obj)
    canvas.renderAll()
    setLayers([...canvas.getObjects()].reverse())
  }

  const selectLayer = (obj: fabric.Object) => {
    if (!canvas) return

    canvas.setActiveObject(obj)
    canvas.renderAll()
    setSelectedObject(obj)
  }

  const getObjectName = (obj: fabric.Object): string => {
    const type = obj.type || 'object'
    if (type === 'textbox' || type === 'text') {
      return (obj as any).text?.substring(0, 20) || 'Text'
    }
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Layers</h3>

      <div className="space-y-1">
        {layers.map((obj, index) => (
          <div
            key={obj.name || index}
            onClick={() => selectLayer(obj)}
            className={`p-2 rounded cursor-pointer transition-colors ${
              selectedObject === obj
                ? 'bg-primary-100 border border-primary-300'
                : 'hover:bg-gray-100 border border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleVisibility(obj)
                  }}
                  className="flex-shrink-0"
                >
                  {obj.visible ? (
                    <Eye className="w-4 h-4 text-gray-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <span className="text-xs text-gray-700 truncate">
                  {getObjectName(obj)}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteLayer(obj)
                }}
                className="flex-shrink-0 ml-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {layers.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-4">
            No layers yet. Add objects to see them here.
          </p>
        )}
      </div>
    </div>
  )
}
