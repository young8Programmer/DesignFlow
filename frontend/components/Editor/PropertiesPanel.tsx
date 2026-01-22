'use client'

import { useEffect, useState } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import { fabric } from 'fabric'

export default function PropertiesPanel() {
  const { canvas, selectedObject, setSelectedObject } = useCanvasStore()
  const [properties, setProperties] = useState<any>({})

  useEffect(() => {
    if (!selectedObject) {
      setProperties({})
      return
    }

    const obj = selectedObject as any
    setProperties({
      fill: obj.fill || '#000000',
      stroke: obj.stroke || '',
      strokeWidth: obj.strokeWidth || 0,
      opacity: obj.opacity || 1,
      left: Math.round(obj.left || 0),
      top: Math.round(obj.top || 0),
      width: Math.round(obj.width || 0),
      height: Math.round(obj.height || 0),
      angle: Math.round(obj.angle || 0),
      scaleX: obj.scaleX || 1,
      scaleY: obj.scaleY || 1,
      fontSize: obj.fontSize || 20,
      fontFamily: obj.fontFamily || 'Arial',
      text: obj.text || '',
    })
  }, [selectedObject])

  const updateProperty = (key: string, value: any) => {
    if (!canvas || !selectedObject) return

    const obj = selectedObject as any
    obj.set(key, value)
    canvas.renderAll()
    setProperties({ ...properties, [key]: value })
  }

  if (!selectedObject) {
    return (
      <div className="w-64 bg-white border-l border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Properties</h3>
        <p className="text-sm text-gray-500">Select an object to edit properties</p>
      </div>
    )
  }

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Properties</h3>

      <div className="space-y-4">
        {/* Text Properties */}
        {(selectedObject.type === 'textbox' || selectedObject.type === 'text') && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
              <textarea
                value={properties.text || ''}
                onChange={(e) => updateProperty('text', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
              <input
                type="number"
                value={properties.fontSize || 20}
                onChange={(e) => updateProperty('fontSize', parseInt(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
              <select
                value={properties.fontFamily || 'Arial'}
                onChange={(e) => updateProperty('fontFamily', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
          </>
        )}

        {/* Color Properties */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Fill Color</label>
          <input
            type="color"
            value={properties.fill || '#000000'}
            onChange={(e) => updateProperty('fill', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Stroke Color</label>
          <input
            type="color"
            value={properties.stroke || '#000000'}
            onChange={(e) => updateProperty('stroke', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Stroke Width</label>
          <input
            type="number"
            value={properties.strokeWidth || 0}
            onChange={(e) => updateProperty('strokeWidth', parseInt(e.target.value))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            min="0"
          />
        </div>

        {/* Position & Size */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">X</label>
            <input
              type="number"
              value={properties.left || 0}
              onChange={(e) => updateProperty('left', parseInt(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Y</label>
            <input
              type="number"
              value={properties.top || 0}
              onChange={(e) => updateProperty('top', parseInt(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
            <input
              type="number"
              value={properties.width || 0}
              onChange={(e) => updateProperty('width', parseInt(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
            <input
              type="number"
              value={properties.height || 0}
              onChange={(e) => updateProperty('height', parseInt(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Opacity */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Opacity: {Math.round((properties.opacity || 1) * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={properties.opacity || 1}
            onChange={(e) => updateProperty('opacity', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
