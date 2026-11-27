import { motion } from 'framer-motion'
import { CheckCircle2, BarChart3, Sparkles, ArrowRight } from 'lucide-react'

function About() {
  return (
    <section className="about-section section" id="about">
      <motion.div
        className="about-image"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=85"
          alt="Modern business office"
        />

        <div className="image-label">
          <span><BarChart3 size={25} /></span>
          <div>
            <strong>Grow Smarter</strong>
            <small>with BudgetWise</small>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="about-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="eyebrow">
          <Sparkles size={14} /> Why Choose BudgetWise?
        </span>

        <h2>Built for <span>Modern Businesses</span></h2>

        <p>
          Whether you're a growing startup or an established company,
          BudgetWise helps you organize spending, improve accountability,
          and make informed financial decisions.
        </p>

        <ul className="benefit-list">
          <li><CheckCircle2 /> Better financial visibility</li>
          <li><CheckCircle2 /> Organized approval workflows</li>
          <li><CheckCircle2 /> Role-based team access</li>
          <li><CheckCircle2 /> Dedicated company installation</li>
        </ul>

        <a href="#contact" className="primary-btn">
          Explore Solutions <ArrowRight size={17} />
        </a>
      </motion.div>
    </section>
  )
}

export default About