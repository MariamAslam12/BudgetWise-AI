import { motion } from 'framer-motion'
import { TrendingUp, PieChart, Users } from 'lucide-react'

const solutions = [
  {
    icon: TrendingUp,
    title: 'For Growing Businesses',
    description: 'Bring expenses, budgets, and financial records together as your team grows.'
  },
  {
    icon: PieChart,
    title: 'For Finance Teams',
    description: 'Simplify expense reviews, invoice tracking, and monthly reporting.'
  },
  {
    icon: Users,
    title: 'For Department Managers',
    description: 'Monitor department spending and manage employee expense approvals.'
  }
]

function Solutions() {
  return (
    <section className="solutions-section section" id="solutions">
      <div className="solutions-heading">
        <span className="eyebrow">Flexible Business Solutions</span>
        <h2>One Platform. <span>Better Financial Control.</span></h2>
        <p>Useful financial tools for the people who manage your business.</p>
      </div>

      <div className="solutions-grid">
        {solutions.map((item, index) => {
          const Icon = item.icon

          return (
            <motion.div
              className="solution-card"
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <Icon size={28} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default Solutions