import { FC, useState, useRef, useEffect } from 'react'
import { Menu, ChevronDown, LogOut, User, Search, Bell, Settings } from 'lucide-react'
import { Link } from '@inertiajs/react'

type HeaderProps = {
  setSidebarOpen: (open: boolean) => void
  userName?: string
  userRole?: string
  notificationsCount?: number
}

const Header: FC<HeaderProps> = ({
  setSidebarOpen,
  userName = "Admin Demo",
  userRole = "Administrateur",
  notificationsCount = 3
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  // Gestion du clic en dehors du menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Génération des initiales
  const initials = userName.split(' ').map(name => name[0]).join('').toUpperCase()

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Bouton menu mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-5 h-5 text-green-800" />
      </button>

      {/* Barre de recherche */}
      <div className="relative mx-4 flex-1 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher médicament, client, fournisseur..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300 focus:bg-white text-sm transition-all duration-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Actions utilisateur */}
      <div className="flex items-center space-x-3">
        {/* Bouton notifications */}
        <button
          className="p-2 relative rounded-full hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label={`Notifications (${notificationsCount} non lues)`}
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {notificationsCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {notificationsCount}
            </span>
          )}
        </button>

        {/* Menu utilisateur */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg p-1"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
          >
            <div className="w-8 h-8 rounded-full bg-green-700 text-white font-medium flex items-center justify-center">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
            <ChevronDown className={`hidden md:block h-4 w-4 text-gray-500 transition-transform ${isMenuOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-50 divide-y divide-gray-100">
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userRole}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <User className="mr-3 h-4 w-4 text-gray-500" />
                  Mon profil
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <Settings className="mr-3 h-4 w-4 text-gray-500" />
                  Paramètres
                </Link>
              </div>

              <div className="py-1">
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4 text-gray-500" />
                  Déconnexion
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
