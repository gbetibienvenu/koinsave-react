import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('koinsave_user'))
    } catch {
      return null
    }
  })

  useEffect(() => {
    localStorage.setItem('koinsave_user', JSON.stringify(user))
  }, [user])

  const login = async (email, password) => {
    try {
      const res = await api.get('/users', { params: { email, password } })
      if (res.data && res.data.length) {
        setUser(res.data[0])
        return { ok: true }
      } else {
        return { ok: false, message: 'Invalid credentials' }
      }
    } catch (err) {
      return { ok: false, message: 'Network or server error' }
    }
  }

  const signup = async (name, email, password) => {
    try {
      const newUser = { name, email, password, balance: 0, transactions: [], profilePic: '' }
      const res = await api.post('/users', newUser)
      setUser(res.data)
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, message: 'Could not create account' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('koinsave_user')
  }

  // NEW: function to update profile picture
  const updateProfilePic = async (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const picData = reader.result
      const updatedUser = { ...user, profilePic: picData }

      try {
        await api.patch(`/users/${user.id}`, updatedUser)
        setUser(updatedUser)
      } catch (err) {
        console.error('Failed to update profile picture', err)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, updateProfilePic }}>
      {children}
    </AuthContext.Provider>
  )
}