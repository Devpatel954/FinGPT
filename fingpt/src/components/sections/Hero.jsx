import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-dot-grid" />
      <div className="hero-fade" />
      <div className="hero-glow" />

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="hero-badge"
        >
          <span className="pulse-dot" />
          Now in Beta &mdash;&nbsp;
          <span className="hero-badge-accent">Real-time financial NLP</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="hero-title"
        >
          AI-Powered <span className="hero-title-accent">Financial</span><br />
          Insights at Your<br />Fingertips
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="hero-sub"
        >
          Analyze financial news, earnings calls, and market trends in real time using
          cutting-edge NLP. Sentiment scores for every stock, sector, and market event.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="hero-btns"
        >
          <a href="/dashboard" className="btn-dark">
            View Dashboard <ArrowRight size={15} />
          </a>
          <a href="#features" className="btn-outline">Explore Features</a>
        </motion.div>


      </div>
    </section>
  );
}
