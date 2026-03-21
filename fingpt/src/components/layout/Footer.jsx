import { TrendingUp, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="nav-logo-icon">
              <TrendingUp size={15} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="footer-brand-text">Fin<span>GPT</span></span>
          </div>

          <p className="footer-tagline">
            AI-powered financial sentiment analysis &mdash; built for traders &amp; analysts.
          </p>

          <div className="footer-socials">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="footer-social-link">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <hr className="footer-divider" />
        <p className="footer-copy">&copy; {new Date().getFullYear()} FinGPT. All rights reserved.</p>
      </div>
    </footer>
  );
}
