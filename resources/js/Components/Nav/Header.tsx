import { FC, useState, useRef, useEffect } from 'react'
import { Menu, ChevronDown, LogOut, User, Search, Bell } from 'lucide-react'
import { Link } from '@inertiajs/react'

type HeaderProps = {
  setSidebarOpen: (open: boolean) => void
}

const Header: FC<HeaderProps> = ({ setSidebarOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
        >
            <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <div className="relative flex-grow max-w-md md:max-w-full md:flex-grow-0">
            <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-green-600 text-sm md:text-base"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
        <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Notifications">
                <Bell className="w-6 h-6 text-gray-700" />
                <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </button>
            <div className="relative" ref={menuRef}>
                <button
                    className="w-10 h-10 rounded-full bg-green-900 text-white font-bold flex items-center justify-center"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    aria-label="Menu utilisateur"
                >
                    {/* {initials} */}
                    AD
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
                    <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                        <User className="w-4 h-4 text-gray-600" />
                        Mon profil
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm w-full text-left"
                    >
                        <LogOut className="w-4 h-4 text-gray-600" />
                        Déconnexion
                    </Link>
                    </div>
                )}
            </div>
        </div>
    </header>
  )
}

export default Header

