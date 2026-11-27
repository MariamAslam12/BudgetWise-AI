
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDB from './config/db.js'
import apiRoutes from './routes/apiRoutes.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}))

app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BudgetWise API',
    status: 'Backend is running'
  })
})

// Connect to MongoDB before handling API requests
app.use('/api', async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    console.error('Database connection error:', error.message)

    res.status(503).json({
      message: 'Database connection failed. Check your MongoDB configuration.'
    })
  }
})

// API routes
app.use('/api', apiRoutes)

// Not found
app.use((req, res) => {
  res.status(404).json({
    message: 'API route not found'
  })
})

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error)

  res.status(error.status || 500).json({
    message: 'Internal server error'
  })
})

// Local development only
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000

  app.listen(PORT, () => {
    console.log(`BudgetWise server running on port ${PORT}`)
  })
}

export default app
