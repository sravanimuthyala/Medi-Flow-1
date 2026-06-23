/**
 * AuthContext.jsx
 * ----------------
 * Provides login, register, logout, and current user
 * to the whole app using React Context.
 *
 * Any component can call useAuth() to get the current user.
 * All auth operations call the backend API.
 */

import { createContext, useContext, useState, useEffect } from 'react'
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  hasToken,
} from '../store/store'

// Create the context object
const AuthContext = createContext(null)

// AuthProvider wraps the whole app and provides auth data
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)       // currently logged-in user
  const [loading, setLoading] = useState(true) // true while checking auth

  // On app start: check if user has a valid token
  useEffect(() => {
    async function checkAuth() {
      if (hasToken()) {
        try {
          const currentUser = await getCurrentUser()
          setUser(currentUser)
        } catch (e) {
          // Token invalid or expired
          setUser(null)
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  // ── Sign In (async) ──────────────────────────────────────────
  async function signIn(email, password) {
    try {
      const loggedInUser = await apiLogin(email, password)
      setUser(loggedInUser)
      return { error: null }
    } catch (e) {
      return { error: e.message || 'Login failed. Please try again.' }
    }
  }

  // ── Register (async) ─────────────────────────────────────────
  async function register(name, email, password, role, phone) {
    try {
      const newUser = await apiRegister({
        name,
        email,
        password,
        role,
        phone: phone || '',
      })
      setUser(newUser)
      return { error: null }
    } catch (e) {
      return { error: e.message || 'Registration failed. Please try again.' }
    }
  }

  // ── Sign Out (async) ──────────────────────────────────────────
  async function signOut() {
    try {
      await apiLogout()
    } catch (e) {
      // Ignore errors on logout
    }
    setUser(null)
  }

  // Provide these values to any child component
  const value = { user, loading, signIn, register, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook - call this in any component to access auth
export function useAuth() {
  return useContext(AuthContext)
}
