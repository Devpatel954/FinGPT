import { useState, useEffect } from 'react';
import { TrendingUp, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Dashboard',   href: '#dashboard' },
  { label: 'Features',    href: '#features' },
  { label: 'How It Works',href: '#architecture' },
  { label: 'Contact',     href: '#cta' },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <nav className="navbar-inner">
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">
            <TrendingUp size={15} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="nav-logo-text">Fin<span>GPT</span></span>
        </a>

        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="nav-link">{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-desktop-cta">
          <a href="/dashboard" className="nav-cta-btn">Get Started</a>
        </div>

        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="nav-mobile-menu">
          <ul className="nav-mobile-links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="nav-mobile-link" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#dashboard" className="nav-mobile-cta">Get Started</a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
