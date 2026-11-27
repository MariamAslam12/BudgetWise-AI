
import { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useParams
} from 'react-router-dom'

// Website components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustedCompanies from './components/TrustedCompanies'
import Features from './components/Features'
import About from './components/About'
import Solutions from './components/Solutions'
import ContactCTA from './components/ContactCTA'
import Footer from './components/Footer'

// Authentication pages
import Login from './pages/Login'
import Signup from './pages/Signup'

// Workspace components
import WorkspaceLayout from './components/workspace/WorkspaceLayout'
import WorkspacePage from './pages/WorkspacePage'

// Allowed roles
const allowedRoles = [
  'employee',
  'finance_manager',
  'company_admin'
]

// Homepage
function Home({ dark, setDark }) {
  return (
    <div className={dark ? 'app dark' : 'app'}>
      <Navbar dark={dark} setDark={setDark} />

      <main>
        <Hero />
        <TrustedCompanies />
        <Features />
        <About />
        <Solutions />
        <ContactCTA />
      </main>

      <Footer />
    </div>
  )
}

// Protected workspace
function WorkspaceGuard() {
  const { role } = useParams()

  let user = null

  try {
    const savedUser = localStorage.getItem('budgetwiseUser')
    user = savedUser ? JSON.parse(savedUser) : null
  } catch {
    user = null
  }

  // Check whether user is logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check saved user's role
  if (!allowedRoles.includes(user.role)) {
    localStorage.removeItem('budgetwiseUser')
    return <Navigate to="/login" replace />
  }

  // Check URL role
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  // User cannot access another role's workspace
  if (user.role !== role) {
    return (
      <Navigate
        to={`/${user.role}/dashboard`}
        replace
      />
    )
  }

  return <Outlet />
}

// Application
function App() {
  const [dark, setDark] = useState(false)

  return (
    <BrowserRouter>
      <Routes>

        {/* Public homepage */}
        <Route
          path="/"
          element={
            <Home
              dark={dark}
              setDark={setDark}
            />
          }
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected workspaces */}
        <Route path="/:role" element={<WorkspaceGuard />}>

          <Route element={<WorkspaceLayout />}>

            <Route
              index
              element={<Navigate to="dashboard" replace />}
            />

            <Route
              path=":section"
              element={<WorkspacePage />}
            />

          </Route>
        </Route>

        {/* Invalid routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
