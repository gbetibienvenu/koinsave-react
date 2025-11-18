import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../utils/auth'

const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 chars' })
})

export default function Login(){
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setError('')
    const res = await login(data.email, data.password)
    if (res.ok) navigate('/dashboard')
    else setError(res.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Koinsave — Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">Email</label>
            <input {...register('email')} className="mt-1 w-full p-2 border rounded bg-transparent text-gray-800 dark:text-white" />
            <p className="text-xs text-red-600">{errors.email?.message}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">Password</label>
            <input type="password" {...register('password')} className="mt-1 w-full p-2 border rounded bg-transparent text-gray-800 dark:text-white" />
            <p className="text-xs text-red-600">{errors.password?.message}</p>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button disabled={isSubmitting} className="w-full py-2 rounded bg-[color:var(--k-green)] text-white">
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Don't have an account? <Link to="/signup" className="text-[color:var(--k-green)]">Sign up</Link></p>
      </div>
    </div>
  )
}
