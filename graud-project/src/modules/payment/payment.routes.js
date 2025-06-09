import express from 'express'
import { protectedRoutes } from '../auth/controller/auth.controller.js'
import { PaymentController } from './payment.controller.js'

const paymentRouter = express.Router()
paymentRouter.use(protectedRoutes)
// Initiate payment
paymentRouter.post('/initiate', PaymentController.initiatePayment)

// Get payment status
paymentRouter.get('/status/:orderId', PaymentController.getPaymentStatus)

export default paymentRouter
