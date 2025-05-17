'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { User, UserInput } from '../types/user'

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEnvModal, setShowEnvModal] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [formData, setFormData] = useState<UserInput>({
    username: '',
    password: '',
    project_url: '',
    project_key: '',
    "Full Name": '',
    active: true,
    access: {}
  })

  const handleAdminAccess = () => {
    setShowPasswordModal(true)
    setPasswordError('')
    setAdminPassword('')
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    
    if (!envPassword) {
      setPasswordError('System configuration error. Please contact administrator.')
      return
    }

    if (adminPassword === envPassword) {
      setIsAdminMode(true)
      setShowPasswordModal(false)
      setSuccessMessage('Admin mode activated successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
      setAdminPassword('')
    } else {
      setPasswordError('Incorrect password. Please try again.')
      setAdminPassword('')
    }
  }

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  // Fetch users
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('myusers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      setError('Error fetching users')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create user
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('myusers')
        .insert([formData])
        .select()

      if (error) throw error
      setUsers([...(data || []), ...users])
      setFormData({
        username: '',
        password: '',
        project_url: '',
        project_key: '',
        "Full Name": '',
        active: true,
        access: {}
      })
      setSuccessMessage('User created successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
      setError(null)
    } catch (error) {
      setError('Error creating user')
      console.error('Error:', error)
    }
  }

  // Update user
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      const { error } = await supabase
        .from('myusers')
        .update(formData)
        .eq('id', editingUser.id)

      if (error) throw error
      
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...formData } : user
      ))
      setEditingUser(null)
      setFormData({
        username: '',
        password: '',
        project_url: '',
        project_key: '',
        "Full Name": '',
        active: true,
        access: {}
      })
      setSuccessMessage('User updated successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
      setError(null)
    } catch (error) {
      setError('Error updating user')
      console.error('Error:', error)
    }
  }

  // Start editing user
  const startEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username || '',
      password: user.password || '',
      project_url: user.project_url || '',
      project_key: user.project_key || '',
      "Full Name": user["Full Name"] || '',
      active: user.active ?? true,
      access: user.access || {}
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <main className="min-h-screen bg-[#0A0F2C] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F2C] via-[#1a1f3c] to-[#2a1f4c] opacity-80 animate-gradient-xy" />
        
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,0,255,0.1)_0%,rgba(76,0,255,0)_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,183,255,0.1)_0%,rgba(0,183,255,0)_50%)] animate-pulse animation-delay-2000" />
        
        {/* Futuristic grid with glow */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_100%)] animate-pulse" />
        </div>
        
        {/* Enhanced floating orbs with new animations */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-[0.15] animate-blob" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-[0.15] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-[0.15] animate-blob animation-delay-4000" />
        
        {/* Additional light effects */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-[96px] opacity-[0.15] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-[96px] opacity-[0.15] animate-pulse animation-delay-2000" />
      </div>

      {/* Enhanced backdrop blur with gradient */}
      <div className="absolute inset-0 backdrop-blur-[80px] bg-gradient-to-b from-transparent via-[#0A0F2C]/10 to-[#0A0F2C]/30" />

      {/* Content */}
      <div className="relative">
        {/* Environment Variables Modal */}
        {showEnvModal && isAdminMode && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div 
              className="bg-[#0A0F2C]/90 rounded-2xl p-8 w-full max-w-2xl mx-auto my-4 shadow-2xl transform transition-all animate-fadeIn border border-white/10 backdrop-blur-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-white">Environment Variables</h2>
                <button
                  onClick={() => setShowEnvModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-300">ADMIN_PASSWORD</h3>
                    <button
                      onClick={() => handleCopy(process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '', 'admin')}
                      className="px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      {copiedField === 'admin' ? (
                        <>
                          <span className="text-green-400">✓</span>
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <span className="text-blue-400">📋</span>
                          <span className="text-gray-300">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg overflow-x-auto">
                    <p className="font-mono text-sm text-white break-all whitespace-pre-wrap">
                      {process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-300">SUPABASE_URL</h3>
                    <button
                      onClick={() => handleCopy(process.env.NEXT_PUBLIC_SUPABASE_URL || '', 'url')}
                      className="px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      {copiedField === 'url' ? (
                        <>
                          <span className="text-green-400">✓</span>
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <span className="text-blue-400">📋</span>
                          <span className="text-gray-300">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg overflow-x-auto">
                    <p className="font-mono text-sm text-white break-all whitespace-pre-wrap">
                      {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-300">SUPABASE_ANON_KEY</h3>
                    <button
                      onClick={() => handleCopy(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', 'key')}
                      className="px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      {copiedField === 'key' ? (
                        <>
                          <span className="text-green-400">✓</span>
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <span className="text-blue-400">📋</span>
                          <span className="text-gray-300">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg overflow-x-auto">
                    <p className="font-mono text-sm text-white break-all whitespace-pre-wrap">
                      {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-300">SUPABASE_EMAIL</h3>
                    <button
                      onClick={() => handleCopy(process.env.NEXT_PUBLIC_SUPABASE_EMAIL || '', 'email')}
                      className="px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      {copiedField === 'email' ? (
                        <>
                          <span className="text-green-400">✓</span>
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <span className="text-blue-400">📋</span>
                          <span className="text-gray-300">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg overflow-x-auto">
                    <p className="font-mono text-sm text-white break-all whitespace-pre-wrap">
                      {process.env.NEXT_PUBLIC_SUPABASE_EMAIL || 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-300">SUPABASE_PASSWORD</h3>
                    <button
                      onClick={() => handleCopy(process.env.NEXT_PUBLIC_SUPABASE_PASSWORD || '', 'password')}
                      className="px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      {copiedField === 'password' ? (
                        <>
                          <span className="text-green-400">✓</span>
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <span className="text-blue-400">📋</span>
                          <span className="text-gray-300">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg overflow-x-auto">
                    <p className="font-mono text-sm text-white break-all whitespace-pre-wrap">
                      {process.env.NEXT_PUBLIC_SUPABASE_PASSWORD || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => setShowEnvModal(false)}
                  className="w-full px-6 py-3 bg-gray-600/50 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 backdrop-blur-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div 
              className="bg-[#0A0F2C]/90 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl transform transition-all animate-fadeIn border border-white/10 backdrop-blur-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-white">Administrator Access</h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-xl"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">
                    Please enter administrator password:
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white backdrop-blur-xl"
                      placeholder="Enter password"
                      autoFocus
                    />
                  </div>
                  {passwordError && (
                    <p className="mt-3 text-sm text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                      {passwordError}
                    </p>
                  )}
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg shadow-blue-500/25"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 backdrop-blur-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12">
            {/* Admin Button - Moved outside of relative positioning */}
            <div className="flex justify-end items-center gap-4 mb-4">
              {isAdminMode && (
                <button
                  onClick={() => setShowEnvModal(true)}
                  className="px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 sm:gap-3 text-sm sm:text-base backdrop-blur-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <span className="text-base sm:text-xl">🔑</span>
                  <span className="hidden sm:inline">View Environment</span>
                  <span className="sm:hidden">Env</span>
                </button>
              )}
              <button
                onClick={handleAdminAccess}
                className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 sm:gap-3 text-sm sm:text-base backdrop-blur-xl
                  ${isAdminMode 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
              >
                {isAdminMode ? (
                  <>
                    <span className="text-base sm:text-xl">✓</span>
                    <span className="hidden sm:inline">Admin Mode</span>
                    <span className="sm:hidden">Admin</span>
                  </>
                ) : (
                  <>
                    <span className="text-base sm:text-xl">🔒</span>
                    <span className="hidden sm:inline">System Administrator</span>
                    <span className="sm:hidden">Admin</span>
                  </>
                )}
              </button>
            </div>

            {/* Title Section */}
            <div className="text-center max-w-2xl mx-auto bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
              <h1 className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 mb-3 sm:mb-4">
                User Management
              </h1>
              <p className="text-gray-300 text-base sm:text-lg">Manage your system users efficiently and securely</p>
            </div>
          </div>

          {/* Messages Section */}
          <div className="max-w-2xl mx-auto space-y-4 mb-6 sm:mb-8 px-4 sm:px-0">
            {successMessage && (
              <div className="p-3 sm:p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-100 animate-fadeIn flex items-center gap-3 backdrop-blur-xl shadow-lg text-sm sm:text-base">
                <span className="text-green-400 text-lg sm:text-xl">✓</span>
                {successMessage}
              </div>
            )}
            {error && (
              <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-100 animate-fadeIn flex items-center gap-3 backdrop-blur-xl shadow-lg text-sm sm:text-base">
                <span className="text-red-400 text-lg sm:text-xl">⚠</span>
                {error}
              </div>
            )}
          </div>

        {/* Form Section */}
          <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl p-4 sm:p-8 rounded-2xl mb-8 sm:mb-12 shadow-2xl transition-all hover:bg-white/10 border border-white/10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 flex items-center justify-center border-b border-white/10 pb-4 text-white">
              {editingUser ? (
                <>
                  <span className="text-blue-400 mr-3 text-xl sm:text-2xl">✎</span>
                  <span>Edit User</span>
                </>
              ) : (
                <>
                  <span className="text-green-400 mr-3 text-xl sm:text-2xl">+</span>
                  <span>Create New User</span>
                </>
              )}
          </h2>
            <form onSubmit={editingUser ? handleUpdate : handleCreate} className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
                    <input
                      type="text"
                      value={formData["Full Name"] || ''}
                      onChange={(e) => setFormData({ ...formData, "Full Name": e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all backdrop-blur-xl text-white placeholder-gray-400"
                      placeholder="Enter full name"
                      disabled={!isAdminMode}
                    />
                  </div>
            <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Username</label>
              <input
                type="text"
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all backdrop-blur-xl text-white placeholder-gray-400"
                required
                      disabled={!isAdminMode}
                      placeholder="Enter username"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
              <input
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all backdrop-blur-xl text-white placeholder-gray-400"
                required
                      disabled={!isAdminMode}
                      placeholder="Enter password"
              />
            </div>
                </div>
                <div className="space-y-6">
            <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Project URL</label>
              <input
                type="text"
                value={formData.project_url || ''}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all backdrop-blur-xl text-white placeholder-gray-400"
                      disabled={!isAdminMode}
                      placeholder="Enter project URL"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Project Key</label>
              <input
                type="text"
                value={formData.project_key || ''}
                onChange={(e) => setFormData({ ...formData, project_key: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all backdrop-blur-xl text-white placeholder-gray-400"
                      disabled={!isAdminMode}
                      placeholder="Enter project key"
              />
            </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Status</label>
                    <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl border border-white/10">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-white/5 disabled:opacity-50"
                        disabled={!isAdminMode}
                      />
                      <span className="text-gray-300">Active</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-6 sm:pt-8 border-t border-white/10 justify-center">
              <button
                type="submit"
                  className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto
                    ${!isAdminMode 
                      ? 'bg-gray-600/50 cursor-not-allowed opacity-50' 
                      : editingUser 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'}`}
                  disabled={!isAdminMode}
                >
                  {editingUser ? (
                    <>
                      <span className="text-lg sm:text-xl">✓</span>
                      <span>Update User</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg sm:text-xl">+</span>
                      <span>Create User</span>
                    </>
                  )}
              </button>
              {editingUser && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null)
                    setFormData({
                      username: '',
                      password: '',
                      project_url: '',
                      project_key: '',
                        "Full Name": '',
                        active: true,
                      access: {}
                    })
                  }}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-600/50 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 justify-center backdrop-blur-xl w-full sm:w-auto"
                    disabled={!isAdminMode}
                >
                    <span className="text-lg sm:text-xl">✕</span>
                    <span>Cancel</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Users List */}
          <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gradient-to-r from-[#1a237e]/50 to-[#1e3799]/50">
                  <tr className="text-left text-xs sm:text-sm">
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium uppercase tracking-wider text-gray-300">Full Name</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium uppercase tracking-wider text-gray-300">Username</th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 font-medium uppercase tracking-wider text-gray-300">Project URL</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium uppercase tracking-wider text-gray-300">Status</th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 font-medium uppercase tracking-wider text-gray-300">Created At</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium uppercase tracking-wider text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                      <td colSpan={6} className="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-400">
                        <div className="flex items-center justify-center gap-3">
                          <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span className="text-base sm:text-lg">Loading users...</span>
                        </div>
                      </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                      <td colSpan={6} className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <span className="text-3xl sm:text-4xl mb-2">📋</span>
                          <span className="text-base sm:text-lg">No users found</span>
                        </div>
                      </td>
                  </tr>
                ) : (
                  users.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap font-medium text-sm sm:text-base text-white">
                          {isAdminMode ? user["Full Name"] : user["Full Name"]?.replace(/./g, '*')}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base text-white">
                          {isAdminMode ? user.username : user.username?.replace(/./g, '*')}
                        </td>
                        <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-300 text-sm sm:text-base">
                          {isAdminMode ? user.project_url : user.project_url?.replace(/./g, '*')}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium
                            ${isAdminMode 
                              ? user.active 
                                ? 'bg-green-100/10 text-green-300' 
                                : 'bg-gray-100/10 text-gray-300'
                              : 'bg-gray-100/10 text-gray-300'}`}>
                            {isAdminMode ? (user.active ? 'Active' : 'Inactive') : '********'}
                          </span>
                        </td>
                        <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-300 text-sm sm:text-base">
                          {isAdminMode 
                            ? new Date(user.created_at).toLocaleDateString()
                            : new Date(user.created_at).toLocaleDateString().replace(/./g, '*')}
                      </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                        <button
                          onClick={() => startEdit(user)}
                              className={`transition-all flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base ${
                                !isAdminMode 
                                  ? 'text-gray-500 cursor-not-allowed' 
                                  : 'text-blue-400 hover:text-blue-300 hover:bg-blue-400/10'
                              }`}
                              disabled={!isAdminMode}
                            >
                              <span className="text-base sm:text-lg">✎</span>
                              <span className="hidden sm:inline">Edit</span>
                        </button>
                          </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 