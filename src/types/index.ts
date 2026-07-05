export type InterventionStatus = 'planifiee' | 'en_cours' | 'terminee' | 'annulee'
export type DemandeStatus = 'nouvelle' | 'en_traitement' | 'resolue' | 'refusee'
export type DemandeType = 'intervention_supplementaire' | 'reclamation' | 'devis' | 'autre'

export interface Client {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone: string | null
  address: string | null
  created_at: string
}

export interface Intervention {
  id: string
  client_id: string
  site_name: string
  service_type: string
  status: InterventionStatus
  scheduled_at: string
  completed_at: string | null
  agent_name: string | null
  notes: string | null
  created_at: string
}

export interface Demande {
  id: string
  client_id: string
  type: DemandeType
  subject: string
  message: string
  status: DemandeStatus
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  client_id: string
  title: string
  body: string
  read: boolean
  created_at: string
  link_to: string | null
}
