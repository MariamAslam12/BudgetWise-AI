
import { useEffect, useState } from 'react'
import { FolderKanban, TrendingUp, Wallet, Receipt } from 'lucide-react'
import { apiRequest } from '../../services/api'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const formatAmount = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await apiRequest('/projects')
        setProjects(data.projects || [])
      } catch (err) {
        setError(err.message || 'Unable to load projects.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) return <div className="dashboard-panel">Loading projects...</div>

  if (error) {
    return (
      <div className="dashboard-panel">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    )
  }

  if (!projects.length) {
    return (
      <div className="dashboard-panel">
        <FolderKanban size={36} />
        <h3>No projects yet</h3>
        <p>
          Projects will appear here automatically when you create
          client invoices and connect them to projects.
        </p>
      </div>
    )
  }

  return (
    <section className="projects-grid">
      {projects.map(project => (
        <article className="dashboard-panel project-card" key={project._id}>
          <div className="project-card-heading">
            <div>
              <span className="project-label">PROJECT</span>
              <h3>{project.name}</h3>
              <p>{project.clientName}</p>
            </div>

            <span className={`project-status ${project.status}`}>
              {project.status?.replace('_', ' ')}
            </span>
          </div>

          <div className="project-financials">
            <div>
              <Wallet size={17} />
              <span>Project budget</span>
              <strong>{formatAmount(project.budgetAmount)}</strong>
            </div>

            <div>
              <TrendingUp size={17} />
              <span>Client invoice revenue</span>
              <strong>{formatAmount(project.revenue)}</strong>
            </div>

            <div>
              <Receipt size={17} />
              <span>Project expenses</span>
              <strong>{formatAmount(project.costs)}</strong>
            </div>
          </div>

          <div className="project-profit">
            <span>Project profit / loss</span>
            <strong className={project.profit >= 0 ? 'income-amount' : 'expense-amount'}>
              {formatAmount(project.profit)}
            </strong>
          </div>

          <div className="project-card-footer">
            <span>{project.clientInvoiceCount || 0} client invoices</span>
            <span>{project.expenseCount || 0} expenses</span>
          </div>
        </article>
      ))}
    </section>
  )
}

export default Projects
