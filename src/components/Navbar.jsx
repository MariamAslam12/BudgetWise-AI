
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight
} from 'lucide-react'

function Navbar({ dark, setDark }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        <span className="logo-icon">
          <BarChart3 size={29} />
        </span>
        <span>BudgetWise</span>
      </Link>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`nav-panel ${menuOpen ? 'active' : ''}`}>
        <nav className="nav-links">
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#features" onClick={closeMenu}>Features</a>
          <a href="#solutions" onClick={closeMenu}>Solutions</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a href="/login" className="login-btn" onClick={closeMenu}>
             Login
          </a>

          <a
            href="#contact"
            className="nav-cta"
            onClick={closeMenu}
          >
            Get a Quote <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </header>
  )
}

export default Navbar
