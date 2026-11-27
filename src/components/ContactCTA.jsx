import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

function ContactCTA() {
  return (
    <section className="contact-section section" id="contact">
      <motion.div
        className="contact-card"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="eyebrow">Let's Work Together</span>

        <h2>
          Ready to Take Control of Your Company's Finances?
        </h2>

        <p>
          Tell us about your business and discover how a dedicated
          BudgetWise installation can support your team.
        </p>

        <div className="contact-buttons">
          <a
            className="white-btn"
            href="mailto:YOUR_EMAIL@example.com?subject=BudgetWise%20Demo"
          >
            Book a Demo <ArrowRight size={17} />
          </a>

          <a
            className="outline-white-btn"
            href="mailto:YOUR_EMAIL@example.com?subject=BudgetWise%20Quote"
          >
            Get a Quote
          </a>
        </div>
      </motion.div>
    </section>
  )
}

export default ContactCTA