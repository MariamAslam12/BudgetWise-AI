import { motion } from 'framer-motion'
import {
  Wallet, Building2, ShieldCheck, FileText,
  BarChart3, Bell, Users, Sparkles, ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: Wallet,
    title: 'Expense Management',
    description: 'Track, organize, and manage all company expenses in one place.'
  },
  {
    icon: Building2,
    title: 'Department Budgets',
    description: 'Create budgets and monitor spending across different teams.'
  },
  {
    icon: ShieldCheck,
    title: 'Approval Workflows',
    description: 'Review and approve employee expense requests with ease.'
  },
  {
    icon: FileText,
    title: 'Invoice Management',
    description: 'Keep vendor invoices, payments, and due dates organized.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Reports',
    description: 'Generate financial reports and understand company spending.'
  },
  {
    icon: Bell,
    title: 'Smart Budget Alerts',
    description: 'Receive notifications when budgets approach their limits.'
  },
  {
    icon: Users,
    title: 'Multi-User Access',
    description: 'Give employees and managers access according to their roles.'
  },
  {
    icon: Sparkles,
    title: 'AI Spending Insights',
    description: 'Discover spending trends and get intelligent financial insights.'
  }
]

function Features() {
  return (
    <section className="features-section section" id="features">
      <motion.div
        className="section-intro"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="eyebrow">✦ Powerful Features</span>

        <h2>
          Everything You Need for <span>Financial Control</span>
        </h2>

        <p>
          From daily expenses to strategic planning, BudgetWise gives
          your company greater visibility and control over its finances.
        </p>

        <a href="#contact" className="text-link">
          Discuss Your Requirements <ArrowRight size={16} />
        </a>
      </motion.div>

      <div className="feature-grid">
        {features.map((feature, index) => {
          const Icon = feature.icon

          return (
            <motion.article
              className="feature-card"
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              whileHover={{ y: -7 }}
            >
              <div className="feature-icon">
                <Icon size={23} />
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

export default Features