import { Building2, Sparkles, TrendingUp, Users, BarChart3 } from 'lucide-react'

function TrustedCompanies() {
  return (
    <section className="trusted section">
      <p>DESIGNED FOR FORWARD-THINKING BUSINESSES</p>

      <div className="trusted-list">
        <span><Building2 /> Tech Companies</span>
        <span><Sparkles /> Digital Agencies</span>
        <span><TrendingUp /> Growing Startups</span>
        <span><Users /> Small Businesses</span>
        <span><BarChart3 /> Enterprise Teams</span>
      </div>
    </section>
  )
}

export default TrustedCompanies