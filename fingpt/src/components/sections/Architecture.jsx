import { motion } from 'framer-motion';
import { Newspaper, Filter, Brain, BarChart2, Bell } from 'lucide-react';
import { pipelineStages } from '../../data/mockData';

const iconMap = { Newspaper, Filter, Brain, BarChart2, Bell };

const stats = [
  { value: '50+',    label: 'News sources ingested daily' },
  { value: '10M+',   label: 'Articles processed to date' },
  { value: '< 50ms', label: 'Sentiment inference latency' },
  { value: '99.9%',  label: 'Pipeline uptime SLA' },
];

export default function Architecture() {
  return (
    <section id="architecture" className="section architecture">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
          style={{ marginBottom: 80 }}
        >
          <p className="section-label">How It Works</p>
          <h2 className="section-title">From raw news to actionable signal</h2>
          <p className="section-sub">
            Our pipeline processes thousands of articles per hour through five automated stages,
            delivering clean intelligence directly to your dashboard.
          </p>
        </motion.div>

        <div className="pipeline">
          {pipelineStages.map((stage, i) => {
            const Icon = iconMap[stage.icon];
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`pipeline-stage pc-${stage.color}`}
              >
                <div className="pipeline-icon-box"><Icon size={19} /></div>
                <span className="pipeline-stage-badge">
                  <span className="pipeline-stage-dot" />
                  Stage {stage.id}
                </span>
                <h3 className="pipeline-stage-title">{stage.title}</h3>
                <p className="pipeline-stage-desc">{stage.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="pipeline-mobile">
          {pipelineStages.map((stage, i) => {
            const Icon = iconMap[stage.icon];
            const isLast = i === pipelineStages.length - 1;
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`pipeline-mobile-stage pc-${stage.color}`}
              >
                <div className="pipeline-mobile-left">
                  <div className="pipeline-mobile-icon"><Icon size={17} /></div>
                  {!isLast && <div className="pipeline-connector" />}
                </div>
                <div className="pipeline-mobile-content">
                  <span className="pipeline-stage-badge">
                    <span className="pipeline-stage-dot" />
                    Stage {stage.id}
                  </span>
                  <h3 className="pipeline-stage-title" style={{ marginTop: 8 }}>{stage.title}</h3>
                  <p className="pipeline-stage-desc">{stage.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="arch-stats"
        >
          {stats.map((s) => (
            <div key={s.label} className="arch-stat-card">
              <div className="arch-stat-value">{s.value}</div>
              <div className="arch-stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
