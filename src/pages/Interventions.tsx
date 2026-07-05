import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useClientProfile } from '../hooks/useClientProfile'
import { StatusBadge } from '../components/StatusBadge'
import type { Intervention } from '../types'

export function Interventions() {
  const { client } = useClientProfile()
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!client) return
    supabase
      .from('interventions')
      .select('*')
      .eq('client_id', client.id)
      .order('scheduled_at', { ascending: false })
      .then(({ data }) => {
        setInterventions((data as Intervention[]) ?? [])
        setLoading(false)
      })
  }, [client])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#2B2622]">Interventions</h1>
        <p className="mt-1 text-sm text-[#5C5349]">
          Historique complet des passages sur vos sites.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#EAE3DA] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#EAE3DA] bg-[#F7F3EC] text-xs uppercase tracking-wide text-[#8A8178]">
              <th className="px-5 py-3 font-medium">Site</th>
              <th className="px-5 py-3 font-medium">Prestation</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Agent</th>
              <th className="px-5 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {!loading && interventions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[#8A8178]">
                  Aucune intervention enregistrée pour le moment.
                </td>
              </tr>
            )}
            {interventions.map((it) => (
              <tr key={it.id} className="border-b border-[#EAE3DA] last:border-0">
                <td className="px-5 py-3.5 font-medium text-[#2B2622]">{it.site_name}</td>
                <td className="px-5 py-3.5 text-[#5C5349]">{it.service_type}</td>
                <td className="px-5 py-3.5 text-[#5C5349]">
                  {new Date(it.scheduled_at).toLocaleDateString('fr-BE')}
                </td>
                <td className="px-5 py-3.5 text-[#5C5349]">{it.agent_name ?? '—'}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={it.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
