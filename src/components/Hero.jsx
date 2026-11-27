import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import DashboardPreview from './DashboardPreview'

function Hero() {
  return (
    <section className="hero section" id="home">
      <div className="hero-bg-circle circle-one" />
      <div className="hero-bg-circle circle-two" />

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="eyebrow">
          <Sparkles size={14} />
          Smart Finance. Stronger Business.
        </span>

        <h1>
          Take Control of Your Company's <span>Spending.</span>
        </h1>

        <p className="hero-description">
          Manage expenses, set budgets, track approvals and get
          powerful financial insights — all in one place.
        </p>

        <div className="hero-buttons">
          <a href="#contact" className="primary-btn">
            Book a Demo <ArrowRight size={17} />
          </a>

          <a href="#features" className="secondary-btn">
            Explore Features
          </a>
        </div>

        <div className="hero-points">
          <span><CheckCircle2 /> Secure & Reliable</span>
          <span><CheckCircle2 /> Easy to Use</span>
          <span><CheckCircle2 /> Built for Businesses</span>
        </div>
      </motion.div>

      <DashboardPreview />
    </section>
  )
}

export default Hero