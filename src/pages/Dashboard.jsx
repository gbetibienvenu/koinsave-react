import React, { useState } from 'react'
import { useAuth } from '../utils/auth'
import SendModal from '../components/SendModal'
import DepositModal from '../components/DepositModal'

export default function Dashboard() {
  const { user, logout, updateProfilePic } = useAuth()
  const [showSend, setShowSend] = useState(false)
  const [showDeposit, setShowDeposit] = useState(false)
  const [preview, setPreview] = useState(user?.profilePic || null)

  // Handle profile picture change
  const handlePicChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result) // Show preview immediately
        updateProfilePic(file)    // Update backend & context
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Profile Picture or Initial */}
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
              {user?.name?.[0]}
            </div>
          )}

          {/* Custom file upload button */}
          <label className="ml-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer text-sm hover:bg-gray-300 dark:hover:bg-gray-600">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePicChange}
              className="hidden"
            />
          </label>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Welcome, {user?.name}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSend(true)}
            className="px-3 py-1 rounded bg-[color:var(--k-green)] text-white"
          >
            Send Money
          </button>
          <button
            onClick={() => setShowDeposit(true)}
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            Deposit Money
          </button>
          <button    onClick={logout}
            className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Balance Card */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-sm text-gray-500">Balance</p>
          <div className="text-2xl font-bold">
            {user?.balance?.toLocaleString(undefined, {
              style: 'currency',
              currency: 'USD',
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <section className="md:col-span-2 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Recent Transactions</h3>
          <ul className="space-y-2">
            {user?.transactions?.map((tx) => (
              <li key={tx.id} className="flex justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    {tx.desc}
                  </div>
                  <div className="text-xs text-gray-500">{tx.date}</div>
                </div>
                <div
                  className={`font-semibold ${
                    tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {tx.type === 'credit' ? '+' : '-'}${tx.amount}
                </div>
              </li>
            ))}
            {!user?.transactions?.length && (
              <li className="text-sm text-gray-500">No transactions yet</li>
            )}
          </ul>
        </section>
      </main>

      {/* Modals */}
      {showSend && <SendModal onClose={() => setShowSend(false)} />}
      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
    </div>
  )
}