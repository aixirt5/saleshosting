'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { User, UserInput } from '../types/user'

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserInput>({
    username: '',
    password: '',
    project_url: '',
    project_key: '',
    access: {}
  })

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
        access: {}
      })
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
        access: {}
      })
      setError(null)
    } catch (error) {
      setError('Error updating user')
      console.error('Error:', error)
    }
  }

  // Delete user
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const { error } = await supabase
        .from('myusers')
        .delete()
        .eq('id', id)

      if (error) throw error
      setUsers(users.filter(user => user.id !== id))
      setError(null)
    } catch (error) {
      setError('Error deleting user')
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
      access: user.access || {}
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">User Management System</h1>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto bg-white/10 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {editingUser ? 'Edit User' : 'Create New User'}
          </h2>
          <form onSubmit={editingUser ? handleUpdate : handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Project URL</label>
              <input
                type="text"
                value={formData.project_url || ''}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Project Key</label>
              <input
                type="text"
                value={formData.project_key || ''}
                onChange={(e) => setFormData({ ...formData, project_key: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {editingUser ? 'Update User' : 'Create User'}
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
                      access: {}
                    })
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-100">
            {error}
          </div>
        )}

        {/* Users List */}
        <div className="max-w-4xl mx-auto bg-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Project URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">Loading...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">No users found</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.project_url}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => startEdit(user)}
                          className="text-primary hover:text-blue-400 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
} 