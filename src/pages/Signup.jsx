import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../utils/auth'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
})

export default function Signup(){
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setError('')
    const res = await signup(data.name, data.email, data.password)
    if (res.ok) navigate('/dashboard')
    else setError(res.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Koinsave — Sign up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">Name</label>
            <input {...register('name')} className="mt-1 w-full p-2 border rounded bg-transparent text-gray-800 dark:text-white" />
            <p className="text-xs text-red-600">{errors.name?.message}</p>
          </div>
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
            {isSubmitting ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Already have an account? <Link to="/login" className="text-[color:var(--k-green)]">Login</Link></p>
      </div>
    </div>
  )
}
