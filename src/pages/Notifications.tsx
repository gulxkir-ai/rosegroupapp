import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useClientProfile } from '../hooks/useClientProfile'
import type { Notification } from '../types'

export function Notifications() {
  const { client } = useClientProfile()
  const [notifications, setNotifications] = useState<Notification[]>([])

  function load(clientId: string) {
    supabase
      .from('notifications')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setNotifications((data as Notification[]) ?? []))
  }

  useEffect(() => {
    if (client) load(client.id)
  }, [client])

  async function markAsRead(id: string) {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    if (client) load(client.id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#2B2622]">Notifications</h1>
        <p className="mt-1 text-sm text-[#5C5349]">
          Mises à jour sur vos interventions et vos demandes.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#EAE3DA] bg-white">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
            <Bell size={20} className="text-[#8A8178]" />
            <p className="text-sm text-[#8A8178]">Aucune notification pour le moment.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.read && markAsRead(n.id)}
              className={`flex w-full items-start gap-3 border-b border-[#EAE3DA] px-5 py-4 text-left last:border-0 ${
                n.read ? 'bg-white' : 'bg-[#D6336C]/5'
              }`}
            >
              <div
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  n.read ? 'bg-transparent' : 'bg-[#D6336C]'
                }`}
              />
              <div>
                <p className="text-sm font-medium text-[#2B2622]">{n.title}</p>
                <p className="mt-0.5 text-sm text-[#5C5349]">{n.body}</p>
                <p className="mt-1 text-xs text-[#8A8178]">
                  {new Date(n.created_at).toLocaleString('fr-BE')}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
