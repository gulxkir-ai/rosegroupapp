import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function Login() {
  const { session, signInWithMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  if (session) return <Navigate to="/" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    const { error } = await signInWithMagicLink(email)
    if (error) {
      setErrorMessage(error)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBF9F6] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#D6336C]" />
          <span className="font-serif text-xl font-semibold tracking-tight text-[#2B2622]">
            Rose Group
          </span>
        </div>

        <h1 className="mb-2 font-serif text-2xl font-semibold text-[#2B2622]">
          Espace client
        </h1>
        <p className="mb-8 text-sm text-[#5C5349]">
          Recevez un lien de connexion sécurisé par email, sans mot de passe.
        </p>

        {status === 'sent' ? (
          <div className="rounded-lg border border-[#D6336C]/20 bg-[#D6336C]/5 px-4 py-3 text-sm text-[#2B2622]">
            Lien envoyé à <span className="font-medium">{email}</span>. Ouvrez votre boîte
            mail pour accéder à votre espace.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#2B2622]">
                Adresse email professionnelle
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@votreentreprise.be"
                className="w-full rounded-lg border border-[#EAE3DA] bg-white px-3.5 py-2.5 text-sm text-[#2B2622] outline-none ring-[#D6336C]/30 placeholder:text-[#8A8178] focus:ring-2"
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-[#B3261E]">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-lg bg-[#D6336C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#BF2A5D] disabled:opacity-60"
            >
              {status === 'sending' ? 'Envoi en cours…' : 'Recevoir mon lien de connexion'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
