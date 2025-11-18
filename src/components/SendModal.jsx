import React, { useState } from 'react'
import { useAuth } from '../utils/auth'
import api from '../api/axios'

export default function SendModal({ onClose }) {
  const { user, setUser } = useAuth()
  const [recipientEmail, setRecipientEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('') // New message field
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSend = async () => {
    const amt = parseFloat(amount)

    if (!recipientEmail || !amount) {
      setError('All fields are required')
      setSuccess('')
      return
    }
    if (amt <= 0) {
      setError('Amount must be positive')
      setSuccess('')
      return
    }
    if (amt > user.balance) {
      setError('Insufficient balance')
      setSuccess('')
      return
    }

    try {
      const res = await api.get('/users', { params: { email: recipientEmail.toLowerCase() } })
      const recipient = res.data.find(u => u.email.toLowerCase() === recipientEmail.toLowerCase())
      if (!recipient) {
        setError('Recipient does not exist')
        setSuccess('')
        return
      }
      if (recipient.id === user.id) {
        setError('You cannot send money to yourself')
        setSuccess('')
        return
      }

      const timestamp = Date.now()
      const timestampStr = new Date().toLocaleString() // Include date + time

      // Transactions now include the message
      const senderTx = {
        id: timestamp,
        type: 'debit',
        amount: amt,
        desc: `Transfer to ${recipient.name}${message ? ` - ${message}` : ''}`,
        date: timestampStr,
      }

      const recipientTx = {
        id: timestamp + 1,
        type: 'credit',
        amount: amt,
        desc: `Received from ${user.name}${message ? ` - ${message}` : ''}`,
        date: timestampStr,
      }

      const updatedSender = {
        ...user,
        balance: user.balance - amt,
        transactions: [senderTx, ...(user.transactions || [])],
      }
      const updatedRecipient = {
        ...recipient,
        balance: recipient.balance + amt,
        transactions: [recipientTx, ...(recipient.transactions || [])],
      }

      await api.patch(`/users/${user.id}`, updatedSender)
      await api.patch(`/users/${recipient.id}`, updatedRecipient)
      setUser(updatedSender)
      setSuccess('Money sent successfully!')
      setError('')
      setRecipientEmail('')
      setAmount('')
      setMessage('')
    } catch (err) {
      console.error(err)
      setError('Failed to send money. Try again.')
      setSuccess('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-80">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Send Money
        </h2>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <input
          type="email"
          placeholder="Recipient Email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          placeholder="Add a short message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <div className="flex justify-end gap-2 mt-2">
          <button onClick={onClose} className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button onClick={handleSend} className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}


// import React, { useState } from 'react'
// import { useAuth } from '../utils/auth'
// import api from '../api/axios'

// export default function SendModal({ onClose }) {
//   const { user, setUser } = useAuth()
//   const [recipientEmail, setRecipientEmail] = useState('')
//   const [amount, setAmount] = useState('')
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')

//   const handleSend = async () => {
//     const amt = parseFloat(amount)

//     // Validation
//     if (!recipientEmail || !amount) {
//       setError('All fields are required')
//       setSuccess('')
//       return
//     }
//     if (amt <= 0) {
//       setError('Amount must be positive')
//       setSuccess('')
//       return
//     }
//     if (amt > user.balance) {
//       setError('Insufficient balance')
//       setSuccess('')
//       return
//     }

//     try {
//       // Normalize email for comparison
//       const res = await api.get('/users', { params: { email: recipientEmail.toLowerCase() } })
//       const recipient = res.data.find(u => u.email.toLowerCase() === recipientEmail.toLowerCase())

//       if (!recipient) {
//         setError('Recipient does not exist')
//         setSuccess('')
//         return
//       }

//       if (recipient.id === user.id) {
//         setError('You cannot send money to yourself')
//         setSuccess('')
//         return
//       }

//       // Timestamp including time
//       const timestampStr = new Date().toLocaleString()

//       // Create transactions
//       const senderTx = {
//         id: Date.now(),
//         type: 'debit',
//         amount: amt,
//         desc: `Transfer to ${recipient.name}`,
//         date: timestampStr,
//       }

//       const recipientTx = {
//         id: Date.now() + 1,
//         type: 'credit',
//         amount: amt,
//         desc: `Received from ${user.name}`,
//         date: timestampStr,
//       }

//       // Update sender
//       const updatedSender = {
//         ...user,
//         balance: user.balance - amt,
//         transactions: [senderTx, ...(user.transactions || [])],
//       }

//       // Update recipient
//       const updatedRecipient = {
//         ...recipient,
//         balance: recipient.balance + amt,
//         transactions: [recipientTx, ...(recipient.transactions || [])],
//       }

//       // Persist updates
//       await api.patch(`/users/${user.id}`, updatedSender)
//       await api.patch(`/users/${recipient.id}`, updatedRecipient)

//       // Update local state
//       setUser(updatedSender)
//       setSuccess('Money sent successfully!')
//       setError('')
//       setRecipientEmail('')
//       setAmount('')
//     } catch (err) {
//       console.error(err)
//       setError('Failed to send money. Try again.')
//       setSuccess('')
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-80">
//         <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
//           Send Money
//         </h2>

//         {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
//         {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

//         <input
//           type="email"
//           placeholder="Recipient Email"
//           value={recipientEmail}
//           onChange={(e) => setRecipientEmail(e.target.value)}
//           className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//         />
//         <input
//           type="number"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//         />

//         <div className="flex justify-end gap-2 mt-2">
//           <button
//             onClick={onClose}
//             className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSend}
//             className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
