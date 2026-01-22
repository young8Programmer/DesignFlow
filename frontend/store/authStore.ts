import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Initialize from localStorage if available
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        const stored = localStorage.getItem('auth-storage')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (parsed.state?.token) {
              return {
                user: parsed.state.user,
                token: parsed.state.token,
                isAuthenticated: true,
                setAuth: (user, token) => {
                  localStorage.setItem('token', token)
                  set({ user, token, isAuthenticated: true })
                },
                logout: () => {
                  localStorage.removeItem('token')
                  set({ user: null, token: null, isAuthenticated: false })
                },
              }
            }
          } catch (e) {
            // Invalid storage, use defaults
          }
        }
      }

      return {
        user: null,
        token: null,
        isAuthenticated: false,
        setAuth: (user, token) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token)
          }
          set({ user, token, isAuthenticated: true })
        },
        logout: () => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
          }
          set({ user: null, token: null, isAuthenticated: false })
        },
      }
    },
    {
      name: 'auth-storage',
    }
  )
)
