import { motion } from 'framer-motion';
import { Activity, Search, Key, Bell, TrendingUp, FileText } from 'lucide-react';

const features = [
  { icon: Activity, title: 'Real-Time Sentiment Scoring', description: 'Every article scored instantly with our fine-tuned financial LLM — polarity, intensity, and confidence metrics in under 50ms.', stat: '< 50ms', statLabel: 'avg. inference', color: 'emerald' },
  { icon: TrendingUp, title: 'Stock Trend Prediction', description: 'Correlate historical sentiment with price action to surface alpha signals before they become consensus. NLP + time-series fusion.', stat: '74%', statLabel: 'directional accuracy', color: 'blue' },
  { icon: Key, title: 'Financial Keyword Extraction', description: 'Automatically extract earnings guidance, risk factors, M&A signals, and regulatory flags from dense financial documents.', stat: '120+', statLabel: 'entity types', color: 'violet' },
  { icon: Bell, title: 'Custom Sentiment Alerts', description: 'Configurable spike alerts for unusual sentiment shifts on your watchlist. Delivered via email, Slack, or webhook in real time.', stat: '< 5s', statLabel: 'alert latency', color: 'orange' },
  { icon: FileText, title: 'Earnings Call Analysis', description: 'Transcribe and score earnings calls automatically. Detect tone shifts, hedging language, and guidance changes quarter-over-quarter.', stat: '50+', statLabel: 'quarters tracked', color: 'pink' },
  { icon: Search, title: 'Semantic News Search', description: 'Query your entire financial news corpus in natural language. Find every mention of a risk, theme, or event with vector-search precision.', stat: '10M+', statLabel: 'articles indexed', color: 'teal' },
];

export default function Features() {
  return (
    <section id="features" className="section features">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
          style={{ marginBottom: 64 }}
        >
          <p className="section-label">Capabilities</p>
          <h2 className="section-title">Everything you need to trade smarter</h2>
          <p className="section-sub">
            FinGPT combines state-of-the-art NLP with financial domain expertise to surface
            insights that traditional tools miss.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`feature-card fc-${feat.color}`}
              >
                <div className="feature-icon-box">
                  <Icon size={19} />
                </div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.description}</p>
                <div className="feature-footer">
                  <div>
                    <span className="feature-stat">{feat.stat}</span>
                    <span className="feature-stat-label">{feat.statLabel}</span>
                  </div>
                  <div className="feature-bar" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
