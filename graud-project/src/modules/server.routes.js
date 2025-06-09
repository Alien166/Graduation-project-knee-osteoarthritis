import { globalError } from '../middleware/globalError.js'
import authRouter from './auth/auth.routes.js'
import predictionRouter from './prediction/prediction.routes.js'
import subscriptionRouter from './subcription/subscription.routes.js'
import express from 'express'
import paymentRouter from './payment/payment.routes.js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

export const bootstrap = (app) => {
  app.get('/', (req, res) => {
    res.json('welcome back backend dev :)')
  })

  // API routes
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/predictions', predictionRouter)
  app.use('/api/v1/subscriptions', subscriptionRouter)
  app.use('/api/v1/payments', paymentRouter)

  // Global error handler
  app.use(globalError)
}
