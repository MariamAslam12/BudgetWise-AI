import { BarChart3, Mail, ArrowUp } from 'lucide-react'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main section">
        <div className="footer-brand">
          <a href="#home" className="logo footer-logo">
            <span className="logo-icon">
              <BarChart3 size={30} />
            </span>
            <span>BudgetWise</span>
          </a>

          <p>Smarter Finance. Stronger Business.</p>
        </div>

        <div className="footer-column">
          <h4>Product</h4>
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <a href="#about">About</a>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <a href="#contact">Contact</a>
          <a href="#contact">Book a Demo</a>
          <a href="#contact">Get a Quote</a>
        </div>

        <div className="footer-column">
          <h4>Connect</h4>
          <a href="mailto:YOUR_EMAIL@example.com">
            <Mail size={15} /> Email Us
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
            in LinkedIn
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 BudgetWise. All rights reserved.</span>
        <a href="#home">
          Back to top <ArrowUp size={13} />
        </a>
      </div>
    </footer>
  )
}

export default Footer