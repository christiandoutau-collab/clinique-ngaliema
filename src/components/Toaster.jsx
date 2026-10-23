import { useEffect, useState } from 'react'
import { onToast } from '../lib/toast'

export default function Toaster() {
  const [message, setMessage] = useState(null)

  useEffect(() => {
    let timer
    const off = onToast((m) => {
      setMessage(m)
      clearTimeout(timer)
      timer = setTimeout(() => setMessage(null), 2800)
    })
    return () => { off(); clearTimeout(timer) }
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-1/2 bottom-6 z-[60] -translate-x-1/2 max-w-[calc(100%-2rem)] rounded-xl bg-blue-deep px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-all duration-300 print:hidden ${
        message ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-6'
      }`}
    >
      {message}
    </div>
  )
}
