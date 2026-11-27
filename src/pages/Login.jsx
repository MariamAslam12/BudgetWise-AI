
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BarChart3, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { apiRequest } from '../services/api'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      })

      // Save authentication token
      localStorage.setItem('budgetwise_token', data.token)

      // Save logged-in user
      localStorage.setItem(
        'budgetwiseUser',
        JSON.stringify(data.user)
      )

      // Navigate according to actual backend role
      navigate(`/${data.user.role}/dashboard`, {
        replace: true
      })

    } catch (error) {
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bw-auth-page">
      <div className="bw-auth-card">

        <Link to="/" className="bw-auth-brand">
          <span><BarChart3 size={25} /></span>
          Budget<span>Wise</span>
        </Link>

        <div className="bw-auth-heading">
          <span>WELCOME BACK</span>
          <h1>Sign in to BudgetWise</h1>
          <p>Access your company's financial workspace.</p>
        </div>

        <form onSubmit={handleLogin} className="bw-auth-form">

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              required
            />
          </label>

          <label>
            Password

            <div className="bw-password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && (
            <p className="bw-auth-error">{error}</p>
          )}

          <button
            className="bw-auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        <p className="bw-auth-footer">
          New company? <Link to="/signup">Set up your company</Link>
        </p>

      </div>
    </div>
  )
}

export default Login
