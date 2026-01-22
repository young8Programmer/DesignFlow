'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { fabric } from 'fabric'
import { useCanvasStore } from '@/store/canvasStore'

interface CanvasEditorProps {
  width?: number
  height?: number
  canvasData?: any
  onSave?: (canvasData: any) => void
}

export default function CanvasEditor({ width = 800, height = 600, canvasData, onSave }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const { setCanvas, addObject, removeObject, updateObject, selectedObject } = useCanvasStore()

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
    })

    fabricCanvasRef.current = canvas
    setCanvas(canvas)

    // Load canvas data if provided
    if (canvasData) {
      canvas.loadFromJSON(canvasData, () => {
        canvas.renderAll()
      })
    }

    // Handle object selection
    canvas.on('selection:created', (e) => {
      if (e.selected && e.selected[0]) {
        useCanvasStore.getState().setSelectedObject(e.selected[0])
      }
    })

    canvas.on('selection:updated', (e) => {
      if (e.selected && e.selected[0]) {
        useCanvasStore.getState().setSelectedObject(e.selected[0])
      }
    })

    canvas.on('selection:cleared', () => {
      useCanvasStore.getState().setSelectedObject(null)
    })

    // Handle object modification
    canvas.on('object:modified', () => {
      if (onSave) {
        onSave(canvas.toJSON())
      }
    })

    // Handle object added
    canvas.on('object:added', (e) => {
      if (e.target) {
        addObject(e.target)
      }
    })

    // Handle object removed
    canvas.on('object:removed', (e) => {
      if (e.target) {
        removeObject(e.target)
      }
    })

    return () => {
      canvas.dispose()
    }
  }, [width, height])

  // Update canvas when canvasData changes externally
  useEffect(() => {
    if (fabricCanvasRef.current && canvasData) {
      fabricCanvasRef.current.loadFromJSON(canvasData, () => {
        fabricCanvasRef.current?.renderAll()
      })
    }
  }, [canvasData])

  return (
    <div className="canvas-container bg-white rounded-lg shadow-lg p-4">
      <canvas ref={canvasRef} className="border border-gray-300" />
    </div>
  )
}
