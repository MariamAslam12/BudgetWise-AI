
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

// API routes
app.use('/api', apiRoutes)

// Not found
app.use((req, res) => {
  res.status(404).json({
    message: 'API route not found'
  })
})

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB()

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log(`BudgetWise server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
