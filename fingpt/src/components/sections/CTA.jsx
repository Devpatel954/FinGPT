import { motion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';

const firms = ['Goldman Sachs', 'Morgan Stanley', 'BlackRock', 'Citadel', 'Two Sigma', 'Jane Street'];

export default function CTA() {
  return (
    <section id="cta" className="cta-section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="cta-box"
      >
        <div className="cta-glow" />
        <div className="cta-dot-grid" />
        <div className="cta-content">
          <p className="cta-label">Get early access</p>
          <h2 className="cta-title">
            Ready to trade on <br />
            <span className="cta-title-accent">real intelligence</span>?
          </h2>
          <p className="cta-sub">
            Join thousands of quants, analysts, and portfolio managers who use FinGPT
            to gain an edge before the market moves.
          </p>
          <div className="cta-btns">
            <a href="/dashboard" className="btn-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
              Try the Demo <ArrowRight size={16} />
            </a>
            <button className="btn-ghost">
              <Github size={16} /> View on GitHub
            </button>
          </div>
          <p className="trust-label">Trusted by professionals at</p>
          <div className="trust-firms">
            {firms.map((f) => <span key={f} className="trust-firm">{f}</span>)}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
