import { NavLink, useNavigate } from 'react-router-dom'
import { HardDrive, UploadCloud, LayoutGrid, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout, getUsername } from '@/lib/api'

const navLinks = [
  { to: '/upload', label: 'Upload', icon: UploadCloud },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
]

export default function Navbar() {
  const navigate = useNavigate()
  const username = getUsername()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <NavLink
          to="/upload"
          className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors"
        >
          <div className="p-1.5 rounded-md bg-primary/10">
            <HardDrive className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-sm tracking-tight">FileVault</span>
        </NavLink>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </NavLink>
          ))}
        </div>

        {/* User info + Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="w-3.5 h-3.5" />
            <span>{username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>

      </nav>
    </header>
  )
}