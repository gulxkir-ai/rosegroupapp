import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, MessageSquarePlus, Bell, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/interventions', label: 'Interventions', icon: ClipboardList },
  { to: '/demandes', label: 'Demandes', icon: MessageSquarePlus },
  { to: '/notifications', label: 'Notifications', icon: Bell },
]

export function Sidebar() {
  const { signOut } = useAuth()

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#EAE3DA] bg-[#FBF9F6]">
      <div className="flex items-center gap-2 px-6 py-7">
        <div className="h-2 w-2 rounded-full bg-[#D6336C]" />
        <span className="font-serif text-lg font-semibold tracking-tight text-[#2B2622]">
          Rose Group
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#D6336C]/10 text-[#D6336C]'
                  : 'text-[#5C5349] hover:bg-[#F0EAE1] hover:text-[#2B2622]'
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#EAE3DA] p-3">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#5C5349] transition-colors hover:bg-[#F0EAE1] hover:text-[#2B2622]"
        >
          <LogOut size={18} strokeWidth={2} />
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}
