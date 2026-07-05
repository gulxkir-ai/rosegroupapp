import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, ClipboardCheck, MessageSquarePlus } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useClientProfile } from '../hooks/useClientProfile'
import { StatusBadge } from '../components/StatusBadge'
import type { Intervention, Demande } from '../types'

export function Dashboard() {
  const { client } = useClientProfile()
  const [nextInterventions, setNextInterventions] = useState<Intervention[]>([])
  const [openDemandes, setOpenDemandes] = useState<Demande[]>([])

  useEffect(() => {
    if (!client) return

    supabase
      .from('interventions')
      .select('*')
      .eq('client_id', client.id)
      .in('status', ['planifiee', 'en_cours'])
      .order('scheduled_at', { ascending: true })
      .limit(4)
      .then(({ data }) => setNextInterventions((data as Intervention[]) ?? []))

    supabase
      .from('demandes')
      .select('*')
      .eq('client_id', client.id)
      .in('status', ['nouvelle', 'en_traitement'])
      .order('created_at', { ascending: false })
      .then(({ data }) => setOpenDemandes((data as Demande[]) ?? []))
  }, [client])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#2B2622]">
          Bonjour{client ? `, ${client.contact_name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-[#5C5349]">
          Voici un aperçu de votre suivi avec Rose Group.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#EAE3DA] bg-white p-5">
          <CalendarClock size={18} className="text-[#D6336C]" />
          <p className="mt-3 text-2xl font-semibold text-[#2B2622]">{nextInterventions.length}</p>
          <p className="text-sm text-[#5C5349]">Interventions à venir</p>
        </div>
        <div className="rounded-xl border border-[#EAE3DA] bg-white p-5">
          <MessageSquarePlus size={18} className="text-[#6F42C1]" />
          <p className="mt-3 text-2xl font-semibold text-[#2B2622]">{openDemandes.length}</p>
          <p className="text-sm text-[#5C5349]">Demandes en cours</p>
        </div>
        <div className="rounded-xl border border-[#EAE3DA] bg-white p-5">
          <ClipboardCheck size={18} className="text-[#2F7A4F]" />
          <p className="mt-3 text-2xl font-semibold text-[#2B2622]">
            {client ? new Date(client.created_at).getFullYear() : '—'}
          </p>
          <p className="text-sm text-[#5C5349]">Client depuis</p>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-[#2B2622]">
            Prochaines interventions
          </h2>
          <Link to="/interventions" className="text-sm font-medium text-[#D6336C] hover:underline">
            Tout voir
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#EAE3DA] bg-white">
          {nextInterventions.length === 0 ? (
            <p className="px-5 py-6 text-sm text-[#8A8178]">
              Aucune intervention planifiée pour le moment.
            </p>
          ) : (
            nextInterventions.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between border-b border-[#EAE3DA] px-5 py-3.5 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-[#2B2622]">{it.site_name}</p>
                  <p className="text-xs text-[#8A8178]">{it.service_type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#5C5349]">
                    {new Date(it.scheduled_at).toLocaleDateString('fr-BE', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <StatusBadge status={it.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-[#2B2622]">Demandes ouvertes</h2>
          <Link to="/demandes" className="text-sm font-medium text-[#D6336C] hover:underline">
            Tout voir
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#EAE3DA] bg-white">
          {openDemandes.length === 0 ? (
            <p className="px-5 py-6 text-sm text-[#8A8178]">Aucune demande en cours.</p>
          ) : (
            openDemandes.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between border-b border-[#EAE3DA] px-5 py-3.5 last:border-0"
              >
                <p className="text-sm font-medium text-[#2B2622]">{d.subject}</p>
                <StatusBadge status={d.status} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
