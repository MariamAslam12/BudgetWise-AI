
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, Wallet } from 'lucide-react'
import './Auth.css'

function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    const password = e.target.password.value
    const confirmPassword = e.target.confirmPassword.value

    if (password !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }

    alert('Registration form submitted. Account creation will be connected later.')
  }

  return (
    <div className="auth-page signup-page">
      <div className="auth-left">
        <Link to="/" className="auth-back">
          <ArrowLeft size={17} /> Back to website
        </Link>

        <div className="auth-brand">
          <span className="brand-icon"><Wallet size={23} /></span>
          <span>Budget<span>Wise</span></span>
        </div>

        <div className="auth-content">
          <span className="auth-eyebrow">GET STARTED</span>
          <h1>Build a smarter way to manage your business.</h1>
          <p>
            Set up your company's financial workspace and bring
            your expenses, budgets and approvals together.
          </p>

          <div className="auth-highlight">
            <div className="highlight-icon">✓</div>
            <div>
              <strong>One workspace for your company</strong>
              <span>Organized finances start here.</span>
            </div>
          </div>
        </div>

        <div className="auth-left-footer">
          © 2026 BudgetWise. All rights reserved.
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap signup-form-wrap">
          <div className="auth-mobile-brand">
            <span className="brand-icon"><Wallet size={21} /></span>
            Budget<span>Wise</span>
          </div>

          <span className="form-eyebrow">COMPANY SETUP</span>
          <h2>Create your account</h2>
          <p className="form-description">
            Register your company administrator account.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="fullName">Administrator name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Your full name"
              required
            />

            <label htmlFor="companyName">Company name</label>
            <input
              id="companyName"
              type="text"
              placeholder="Your company name"
              required
            />

            <label htmlFor="signupEmail">Work email</label>
            <input
              id="signupEmail"
              type="email"
              placeholder="you@company.com"
              required
            />

            <label htmlFor="signupPassword">Password</label>
            <div className="password-input">
              <input
                id="signupPassword"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                minLength="8"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <label htmlFor="confirmPassword">Confirm password</label>
            <div className="password-input">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm your password"
                minLength="8"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <label className="remember-option terms-option">
              <input type="checkbox" required />
              <span>I agree to the terms and privacy policy.</span>
            </label>

            <button type="submit" className="auth-submit">
              Create account <span>→</span>
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <div className="auth-secure">
            <span>✦</span> Secure company administrator registration
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
