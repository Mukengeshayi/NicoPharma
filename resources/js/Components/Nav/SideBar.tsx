import { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import {X,LayoutDashboard,Pill,Layers,Boxes,PackageCheck,ShoppingCart,Truck,User,Users,HandCoins,Settings,ChevronDown,ChevronRight,ClipboardList,Warehouse,FileBarChart,ShieldCheck,UserCog,ListOrdered,
} from 'lucide-react'

const navItems = [
  {
    label: 'Tableau de Bord',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Médicaments',
    href: '#',
    icon: Pill,
    children: [
      {
        label: 'Formes',
        href: route("forms.index"),
        icon: Layers,
      },
      {
        label: 'Familles',
        href: route("families.index"),
        icon: Boxes,
      },
       {
        label: 'Liste des Médicaments',
        href: '/medicines',
        icon: ListOrdered,
        },
      {
        label: 'Stock Médicaments',
        href: '/medicaments/stock',
        icon: Warehouse,
      },
      {
        label: 'Lots Médicaments',
        href: '/medicaments/lots',
        icon: PackageCheck,
      },
    ],
  },
  {
    label: 'Approvisionnement',
    href: '#',
    icon: Truck,
    children: [
      {
        label: 'Fournisseurs',
        href: '/approvisionnement/fournisseurs',
        icon: Users,
      },
      {
        label: 'Achats',
        href: '/approvisionnement/achats',
        icon: ClipboardList,
      },
    ],
  },
  {
    label: 'Gestion des Ventes',
    href: '#',
    icon: ShoppingCart,
    children: [
      {
        label: 'Clients',
        href: '/ventes/clients',
        icon: User,
      },
      {
        label: 'Ventes',
        href: '/ventes',
        icon: HandCoins,
      },
    ],
  },
  {
    label: 'Rapports',
    href: '/rapports',
    icon: FileBarChart,
  },
  {
    label: 'Utilisateurs',
    href: '/utilisateurs',
    icon: Users,
    children: [
      {
        label: 'Rôles & Permissions',
        href: '/utilisateurs/roles',
        icon: ShieldCheck,
      },
      {
        label: 'Utilisateurs',
        href: '/utilisateurs',
        icon: UserCog,
      },
    ],
  },
  {
    label: 'Paramètres',
    href: '/settings',
    icon: Settings,
  },
]


type SidebarProps = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}
export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const { url } = usePage()

  const toggleSubMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  const isActive = (href: string) => {
    return url.startsWith(href)
  }

  const mainItems = navItems.filter(item => item.label !== 'Paramètres')
  const settingsItem = navItems.find(item => item.label === 'Paramètres')

  return (
    <aside
      className={`fixed z-30 md:static top-0 left-0 h-screen w-64 bg-green-900 text-white shadow-lg border-r border-green-800 transition-transform duration-300
      ${sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 768) ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo & Close */}
        <div className="flex items-center justify-between px-6 py-4">
          <img src="/images/logo1.png" alt="Logo Pharmacie" className="h-10 object-contain" />
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Zone scrollable pour le menu principal */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 gap-1">
          {mainItems.map(({ label, href, icon: Icon, children }) => {
            const active = isActive(href)
            return (
              <div key={label}>
                <div
                  onClick={() => children && toggleSubMenu(label)}
                  className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all
                    ${active ? 'bg-green-800 text-white' : 'hover:bg-green-700 text-gray-200'}`}
                >
                  <Link
                    href={href}
                    className="flex items-center gap-3 flex-1 text-base font-bold"
                  >
                    <Icon className="w-6 h-6" />
                    {label}
                  </Link>
                  {children && (
                    <span>
                      {openMenus.includes(label) ? (
                        <ChevronDown className="w-6 h-6" />
                      ) : (
                        <ChevronRight className="w-6 h-6" />
                      )}
                    </span>
                  )}
                </div>

                {children && openMenus.includes(label) && (
                  <div className="ml-6 mt-1 pl-2 py-1 border-l border-green-100">
                    {children.map(({ label: subLabel, href: subHref, icon: SubIcon }) => (
                      <Link
                        key={subHref}
                        href={subHref}
                        className={`flex items-center gap-2 px-2 py-2 rounded-lg text-base transition-all font-semibold
                          ${isActive(subHref)
                            ? 'bg-green-700 text-white'
                            : 'text-gray-300 hover:bg-green-800'}`}
                      >
                        <SubIcon className="w-6 h-6" />
                        {subLabel}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Paramètres collé en bas */}
        {settingsItem && (
          <div className="sticky bottom-0 px-2 py-2 bg-green-900 border-t border-green-800">
            <Link
              href={settingsItem.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-base font-bold transition-all
                ${isActive(settingsItem.href)
                  ? 'bg-green-800 text-white'
                  : 'hover:bg-green-700 text-gray-200'}`}
            >
              <settingsItem.icon className="w-8 h-8" />
              {settingsItem.label}
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}



