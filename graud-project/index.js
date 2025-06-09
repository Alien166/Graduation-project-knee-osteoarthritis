import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { dbConnection } from './db/dbConnection.js'
import { bootstrap } from './src/modules/server.routes.js'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(
  'E:',
  'knee-osteoarthritis',
  'graud-project',
  'uploads'
)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('Created uploads directory at:', uploadsDir)
}

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

// Initialize server
const startServer = async () => {
  try {
    // Connect to database first
    await dbConnection()

    // Setup routes
    bootstrap(app)

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()
