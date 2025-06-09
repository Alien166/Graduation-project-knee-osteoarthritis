import express from 'express'

import { subscriptionController } from './controller/subscription.controller.js'
import { validation } from '../../middleware/validation.js'
import {
  getPlansVal,
  getStatusVal,
  subscribeVal,
  upgradeVal,
  initializeTrialVal,
  createPlanVal,
  cancelVal,
  updatePlanVal,
} from './subscription.validation.js'
import { protectedRoutes } from '../auth/controller/auth.controller.js'

const subscriptionRouter = express.Router()

// All subscription routes require authentication
subscriptionRouter.use(protectedRoutes)

// Get all available subscription plans
subscriptionRouter.get(
  '/plans',
  validation(getPlansVal),
  subscriptionController.getPlans
)

// Get user's subscription status
subscriptionRouter.get(
  '/status',
  validation(getStatusVal),
  subscriptionController.getSubscriptionStatus
)

// Subscribe to a plan
subscriptionRouter.post(
  '/subscribe',
  validation(subscribeVal),
  subscriptionController.subscribeToPlan
)

// Upgrade subscription plan
subscriptionRouter.post(
  '/upgrade',
  validation(upgradeVal),
  subscriptionController.upgradePlan
)

// Cancel subscription
subscriptionRouter.post(
  '/cancel',
  validation(cancelVal),
  subscriptionController.cancelSubscription
)

// Initialize trial for new user
subscriptionRouter.post(
  '/initialize-trial',
  validation(initializeTrialVal),
  subscriptionController.initializeTrial
)

subscriptionRouter.post(
  '/plans',
  validation(createPlanVal),
  subscriptionController.createPlan
)

// // Admin routes
// subscriptionRouter.post(
//   '/plans',
//   validation(createPlanVal),
//   subscriptionController.createPlan
// )
// subscriptionRouter.patch(
//   '/plans/:planId',
//   validation(updatePlanVal),
//   subscriptionController.updatePlan
// )

export default subscriptionRouter
