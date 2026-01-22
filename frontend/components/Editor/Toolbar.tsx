'use client'

import { useCanvasStore } from '@/store/canvasStore'
import { fabric } from 'fabric'
import { Type, Square, Circle, Image, Trash2, Download, Save } from 'lucide-react'

export default function Toolbar() {
  const { canvas, selectedObject, setSelectedObject } = useCanvasStore()

  const addText = () => {
    if (!canvas) return

    const text = new fabric.Textbox('Double click to edit', {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 20,
      fontFamily: 'Arial',
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }

  const addRectangle = () => {
    if (!canvas) return

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#3b82f6',
    })

    canvas.add(rect)
    canvas.setActiveObject(rect)
    canvas.renderAll()
  }

  const addCircle = () => {
    if (!canvas) return

    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: '#3b82f6',
    })

    canvas.add(circle)
    canvas.setActiveObject(circle)
    canvas.renderAll()
  }

  const addImage = () => {
    if (!canvas) return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event: any) => {
          fabric.Image.fromURL(event.target.result, (img) => {
            img.scaleToWidth(200)
            img.set({
              left: 100,
              top: 100,
            })
            canvas.add(img)
            canvas.setActiveObject(img)
            canvas.renderAll()
          })
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const deleteSelected = () => {
    if (!canvas || !selectedObject) return

    canvas.remove(selectedObject)
    canvas.renderAll()
    setSelectedObject(null)
  }

  const downloadAsImage = () => {
    if (!canvas) return

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
    })

    const link = document.createElement('a')
    link.download = 'design.png'
    link.href = dataURL
    link.click()
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center space-x-2 overflow-x-auto">
      <button
        onClick={addText}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title="Add Text"
      >
        <Type className="w-5 h-5" />
        <span className="hidden sm:inline">Text</span>
      </button>

      <button
        onClick={addRectangle}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title="Add Rectangle"
      >
        <Square className="w-5 h-5" />
        <span className="hidden sm:inline">Rectangle</span>
      </button>

      <button
        onClick={addCircle}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title="Add Circle"
      >
        <Circle className="w-5 h-5" />
        <span className="hidden sm:inline">Circle</span>
      </button>

      <button
        onClick={addImage}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title="Add Image"
      >
        <Image className="w-5 h-5" />
        <span className="hidden sm:inline">Image</span>
      </button>

      <div className="w-px h-8 bg-gray-300 mx-2" />

      {selectedObject && (
        <button
          onClick={deleteSelected}
          className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          title="Delete Selected"
        >
          <Trash2 className="w-5 h-5" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      )}

      <div className="flex-1" />

      <button
        onClick={downloadAsImage}
        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        title="Download"
      >
        <Download className="w-5 h-5" />
        <span className="hidden sm:inline">Download</span>
      </button>
    </div>
  )
}
