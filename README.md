# Rose Group — Espace Client

Portail client pour Rose Group : connexion sans mot de passe (lien magique),
historique des interventions, suivi des demandes, notifications.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Supabase (auth par magic link + base de données Postgres avec Row Level Security)
- React Router

## Démarrage

```bash
npm install
cp .env.example .env   # puis renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run dev
```

## Configuration Supabase

1. Créer un projet sur supabase.com.
2. Dans SQL Editor, exécuter le contenu de `supabase/schema.sql` : cela crée les
   tables `clients`, `interventions`, `demandes`, `notifications` avec les policies
   RLS (chaque client ne voit que ses propres données).
3. Dans Authentication → Providers, activer Email et le mode Magic Link.
4. Dans Authentication → URL Configuration, ajouter l'URL du site déployé
   (et http://localhost:5173 en développement) dans les Redirect URLs.
5. Copier Project URL et anon public key (Settings → API) dans `.env`.

## Créer un client (côté équipe Rose Group)

Les clients ne s'inscrivent pas eux-mêmes : un compte est créé par l'équipe
via le dashboard Supabase (Authentication → Users → Invite user), puis un
enregistrement correspondant est ajouté dans la table `clients` avec le même
`user_id`. C'est ce lien qui donne accès aux bonnes interventions/demandes.

## Structure

```
src/
  contexts/AuthContext.tsx   → session Supabase + connexion par lien magique
  hooks/useClientProfile.ts  → résout l'utilisateur connecté vers sa fiche client
  components/layout/         → sidebar + layout principal
  pages/                     → Connexion, Tableau de bord, Interventions, Demandes, Notifications
  types/                     → modèle de données partagé
supabase/schema.sql          → schéma + policies RLS
```

## Déploiement

Le projet est un site statique buildé par Vite (npm run build → dossier dist/),
déployable sur Netlify, Vercel ou Lovable. Penser à renseigner les variables
d'environnement VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY côté hébergeur.
