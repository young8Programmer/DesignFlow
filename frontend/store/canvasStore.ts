import { create } from 'zustand'
import { fabric } from 'fabric'

interface CanvasState {
  canvas: fabric.Canvas | null
  objects: fabric.Object[]
  selectedObject: fabric.Object | null
  setCanvas: (canvas: fabric.Canvas) => void
  addObject: (object: fabric.Object) => void
  removeObject: (object: fabric.Object) => void
  updateObject: (object: fabric.Object) => void
  setSelectedObject: (object: fabric.Object | null) => void
  clearCanvas: () => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
  canvas: null,
  objects: [],
  selectedObject: null,
  setCanvas: (canvas) => set({ canvas }),
  addObject: (object) => set((state) => ({ objects: [...state.objects, object] })),
  removeObject: (object) => set((state) => ({
    objects: state.objects.filter((obj) => obj !== object),
  })),
  updateObject: (object) => set((state) => ({
    objects: state.objects.map((obj) => (obj === object ? object : obj)),
  })),
  setSelectedObject: (object) => set({ selectedObject: object }),
  clearCanvas: () => set({ objects: [], selectedObject: null }),
}))
