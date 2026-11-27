
import mongoose from 'mongoose'

let cached = globalThis.mongoose

if (!cached) {
  cached = globalThis.mongoose = {
    conn: null,
    promise: null
  }
}

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing from environment variables')
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI)
      .then(() => {
        console.log('MongoDB connected successfully')
        return mongoose.connection
      })
      .catch((error) => {
        cached.promise = null
        console.error('MongoDB connection failed:', error.message)
        throw error
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB
