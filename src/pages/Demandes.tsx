import { useEffect, useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useClientProfile } from '../hooks/useClientProfile'
import { StatusBadge } from '../components/StatusBadge'
import type { Demande, DemandeType } from '../types'

const TYPE_LABELS: Record<DemandeType, string> = {
  intervention_supplementaire: 'Intervention supplémentaire',
  reclamation: 'Réclamation',
  devis: 'Demande de devis',
  autre: 'Autre',
}

export function Demandes() {
  const { client } = useClientProfile()
  const [demandes, setDemandes] = useState<Demande[]>([])
  const [showForm, setShowForm] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState<DemandeType>('autre')
  const [submitting, setSubmitting] = useState(false)

  function loadDemandes(clientId: string) {
    supabase
      .from('demandes')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setDemandes((data as Demande[]) ?? []))
  }

  useEffect(() => {
    if (client) loadDemandes(client.id)
  }, [client])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!client) return
    setSubmitting(true)

    await supabase.from('demandes').insert({
      client_id: client.id,
      type,
      subject,
      message,
      status: 'nouvelle',
    })

    setSubject('')
    setMessage('')
    setType('autre')
    setShowForm(false)
    setSubmitting(false)
    loadDemandes(client.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#2B2622]">Demandes</h1>
          <p className="mt-1 text-sm text-[#5C5349]">
            Réclamations, devis ou interventions supplémentaires.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-[#D6336C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#BF2A5D]"
        >
          <Plus size={16} />
          Nouvelle demande
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-[#EAE3DA] bg-white p-5"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#2B2622]">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DemandeType)}
              className="w-full rounded-lg border border-[#EAE3DA] px-3.5 py-2.5 text-sm text-[#2B2622] outline-none ring-[#D6336C]/30 focus:ring-2"
            >
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#2B2622]">Objet</label>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-[#EAE3DA] px-3.5 py-2.5 text-sm text-[#2B2622] outline-none ring-[#D6336C]/30 placeholder:text-[#8A8178] focus:ring-2"
              placeholder="Ex : Nettoyage supplémentaire suite à événement"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#2B2622]">Message</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-[#EAE3DA] px-3.5 py-2.5 text-sm text-[#2B2622] outline-none ring-[#D6336C]/30 placeholder:text-[#8A8178] focus:ring-2"
              placeholder="Décrivez votre demande en détail…"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[#D6336C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#BF2A5D] disabled:opacity-60"
          >
            {submitting ? 'Envoi…' : 'Envoyer la demande'}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-[#EAE3DA] bg-white">
        {demandes.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-[#8A8178]">
            Aucune demande envoyée pour le moment.
          </p>
        ) : (
          demandes.map((d) => (
            <div key={d.id} className="border-b border-[#EAE3DA] px-5 py-4 last:border-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#2B2622]">{d.subject}</p>
                <StatusBadge status={d.status} />
              </div>
              <p className="mt-1 text-xs text-[#8A8178]">
                {TYPE_LABELS[d.type]} · {new Date(d.created_at).toLocaleDateString('fr-BE')}
              </p>
              <p className="mt-2 text-sm text-[#5C5349]">{d.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
