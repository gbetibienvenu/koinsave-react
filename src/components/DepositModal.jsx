import React, { useState } from 'react'
import { useAuth } from '../utils/auth'
import api from '../api/axios'

export default function DepositModal({ onClose }) {
  const { user, setUser } = useAuth()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleDeposit = async () => {
    const amt = parseFloat(amount)
    if (!amount || amt <= 0) {
      setError('Amount must be positive')
      setSuccess('')
      return
    }

    const timestampStr = new Date().toLocaleString()

    const newTransaction = {
      id: Date.now(),
      type: 'credit',
      amount: amt,
      desc: 'Deposit',
      date: timestampStr
    }

    const updatedUser = {
      ...user,
      balance: user.balance + amt,
      transactions: [newTransaction, ...(user.transactions || [])]
    }

    try {
      await api.patch(`/users/${user.id}`, updatedUser)

      setUser(updatedUser)
      setSuccess('Deposit successful!')
      setAmount('')
      setError('')

      onClose() //Automatically close after success
    } catch (err) {
      setError(`Failed to deposit: ${err.message}`)
      setSuccess('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-80">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Deposit Money</h2>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleDeposit}
            className="px-3 py-1 rounded bg-[color:var(--k-green)] text-white hover:bg-green-700"
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  )
}