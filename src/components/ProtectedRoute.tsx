import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FBF9F6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D6336C] border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/connexion" replace />
  }

  return <>{children}</>
}
