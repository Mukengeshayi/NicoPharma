import { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import {
  X, LayoutDashboard, Pill, Layers, Boxes, PackageCheck, ShoppingCart, Truck,
  User, Users, HandCoins, Settings, ChevronDown, ChevronRight, ClipboardList,
  Warehouse, FileBarChart, ShieldCheck, UserCog, ListOrdered, AlertCircle,
  CalendarDays, Activity, LineChart, Clock, Home, PlusCircle, ScrollText,
  Package
} from 'lucide-react'

const navItems = [
  {
    label: 'Tableau de Bord',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true
  },
  {
    label: 'Médicaments',
    href: '#',
    icon: Pill,
    children: [
      {
        label: 'Formes Galéniques',
        href: route("forms.index"),
        icon: Layers,
      },
      {
        label: 'Familles Thérapeutiques',
        href: route("families.index"),
        icon: Boxes,
      },
      {
        label: 'Unités d\'Emballage',
        href: '/units',
        icon: PackageCheck,
      },
      {
        label: 'Liste Médicaments',
        href: '/medicines',
        icon: ListOrdered,
      },
      {
        label: 'Conditionnement',
        href: '/medicines',
        icon: Package,
      },
    ],
  },
  {
    label: 'Gestion de Stock',
    href: '#',
    icon: Warehouse,
    children: [
      {
        label: 'Gestion des lots',
        href: '/stock/lots',
        icon: PackageCheck,
      },
      {
        label: 'Inventaire',
        href: '/stock/inventaire',
        icon: ClipboardList,
      },
      {
        label: 'Alertes Péremption',
        href: '/stock/alertes',
        icon: AlertCircle,
        alert: true
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
        href: '/suppliers',
        icon: Users,
      },
      {
        label: 'Commandes',
        href: '/procurements',
        icon: ScrollText,
      },
      {
        label: 'Nouvelle Commande',
        href: '/procurements/create',
        icon: PlusCircle,
        accent: true
      },
    ],
  },
  {
    label: 'Ventes',
    href: '#',
    icon: ShoppingCart,
    children: [
      {
        label: 'Clients/Patients',
        href: '/customers',
        icon: User,
      },
      {
        label: 'Nouvelle Vente',
        href: '/sales/create',
        icon: PlusCircle,
        accent: true
      },
      {
        label: 'Historique Ventes',
        href: '/sales',
        icon: HandCoins,
      },
      {
        label: 'Ordonnances',
        href: '/prescriptions',
        icon: ScrollText,
      },
    ],
  },
  {
    label: 'Rap2ports',
    href: '#',
    icon: FileBarChart,
    children: [
      {
        label: 'Ventes Journalières',
        href: '/reports/daily-sales',
        icon: CalendarDays
      },
      {
        label: 'Médicaments Vendus',
        href: '/reports/top-medicines',
        icon: Activity
      },
      {
        label: 'Stock Critique',
        href: '/reports/stock-alerts',
        icon: AlertCircle
      },
      {
        label: 'Chiffre d\'Affaires',
        href: '/reports/revenue',
        icon: LineChart
      },
    ]
  },
  {
    label: 'Administration',
    href: '#',
    icon: UserCog,
    children: [
      {
        label: 'Utilisateurs',
        href: '/users',
        icon: Users,
      },
      {
        label: 'Rôles & Permissions',
        href: '/roles',
        icon: ShieldCheck,
      },
      {
        label: 'Journal d\'Activité',
        href: '/activity-log',
        icon: ClipboardList
      }
    ],
  },
]

type SidebarProps = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const { url } = usePage()

  const toggleMenu = (label: string) => {
    setOpenMenus(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    )
  }

  const isActive = (href: string, exact = false) => {
    return exact ? url === href : url.startsWith(href)
  }

  // Group items by category
  const regularItems = navItems.filter(item => !item.bottom)
  const bottomItem = navItems.find(item => item.bottom)

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-green-800 text-white
      shadow-xl border-r border-green-700 transition-all duration-300
      transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0
    `}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-green-700">
          <div className="flex items-center space-x-3">
            <Pill className="h-7 w-7 text-white" />
            <span className="text-xl font-bold whitespace-nowrap">NicolePharma</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-md hover:bg-green-700 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {regularItems.map((item) => (
            <div key={item.label} className="px-2">
              <div
                onClick={() => item.children && toggleMenu(item.label)}
                className={`
                  flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer
                  transition-colors duration-200
                  ${isActive(item.href, item.exact) ? 'bg-green-700' : 'hover:bg-green-700'}
                `}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-3 flex-1 text-base font-semibold"
                >
                  <item.icon className={`w-5 h-5 ${isActive(item.href, item.exact) ? 'text-white' : 'text-green-200'}`} />
                  <span>{item.label}</span>
                </Link>
                {item.children && (
                  <ChevronDown className={`
                    w-5 h-5 transition-transform duration-200
                    ${openMenus.includes(item.label) ? 'rotate-180' : ''}
                  `} />
                )}
              </div>

              {item.children && openMenus.includes(item.label) && (
                <div className="ml-8 mt-1 pl-2 py-1 border-l-2 border-green-600 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                        transition-colors duration-200 font-medium
                        ${isActive(child.href)
                          ? 'bg-green-700 text-white'
                          : 'text-green-100 hover:bg-green-700/80'}
                        ${child.accent ? 'text-yellow-300 hover:text-yellow-200' : ''}
                        ${child.alert ? 'text-red-300 hover:text-red-200' : ''}
                      `}
                    >
                      {child.icon && <child.icon className="w-4 h-4" />}
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Settings */}
        {bottomItem && (
          <div className="p-4 border-t border-green-700">
            <Link
              href={bottomItem.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg
                transition-colors duration-200 font-semibold
                ${isActive(bottomItem.href)
                  ? 'bg-green-700 text-white'
                  : 'hover:bg-green-700 text-green-100'}
              `}
            >
              <bottomItem.icon className="w-5 h-5" />
              <span>{bottomItem.label}</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
