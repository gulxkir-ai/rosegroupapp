const STYLES: Record<string, string> = {
  planifiee: 'bg-[#6F42C1]/10 text-[#6F42C1]',
  en_cours: 'bg-[#D6336C]/10 text-[#D6336C]',
  terminee: 'bg-[#2F7A4F]/10 text-[#2F7A4F]',
  annulee: 'bg-[#8A8178]/10 text-[#8A8178]',
  nouvelle: 'bg-[#6F42C1]/10 text-[#6F42C1]',
  en_traitement: 'bg-[#D6336C]/10 text-[#D6336C]',
  resolue: 'bg-[#2F7A4F]/10 text-[#2F7A4F]',
  refusee: 'bg-[#8A8178]/10 text-[#8A8178]',
}

const LABELS: Record<string, string> = {
  planifiee: 'Planifiée',
  en_cours: 'En cours',
  terminee: 'Terminée',
  annulee: 'Annulée',
  nouvelle: 'Nouvelle',
  en_traitement: 'En traitement',
  resolue: 'Résolue',
  refusee: 'Refusée',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        STYLES[status] ?? 'bg-[#8A8178]/10 text-[#8A8178]'
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  )
}
