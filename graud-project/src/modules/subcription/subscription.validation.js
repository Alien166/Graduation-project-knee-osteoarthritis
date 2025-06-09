import joi from 'joi'

// Get plans validation
const getPlansVal = joi.object({
  sort: joi.string().valid('price', '-price', 'name', '-name'),
  limit: joi.number().integer().min(1).max(100),
  active: joi.boolean(),
})

// Get subscription status validation
const getStatusVal = joi.object({
  includeHistory: joi.boolean(),
  includeDetails: joi.boolean(),
})

// Subscribe to plan validation
const subscribeVal = joi.object({
  planId: joi.string().required(),
  paymentMethod: joi.string().valid('credit_card', 'paypal').required(),
  autoRenew: joi.boolean().default(true),
  billingCycle: joi.string().valid('monthly', 'yearly').default('monthly'),
})

// Upgrade plan validation
const upgradeVal = joi.object({
  planId: joi.string().required(),
  paymentMethod: joi.string().valid('credit_card', 'paypal').required(),
  autoRenew: joi.boolean().default(true),
  billingCycle: joi.string().valid('monthly', 'yearly').default('monthly'),
})

// Cancel subscription validation
const cancelVal = joi.object({
  reason: joi.string().max(500),
  immediate: joi.boolean().default(false),
  feedback: joi.string().max(1000),
})

// Initialize trial validation
const initializeTrialVal = joi.object({
  planId: joi.string().required(),
})

// Create plan validation (for admin)
const createPlanVal = joi.object({
  name: joi.string().min(3).max(50).required(),
  price: joi.number().min(0).required(),
  features: joi.array().items(joi.string()).min(1).required(),
  recommended: joi.boolean().default(false),
  trialDays: joi.number().integer().min(0).max(30).default(14),
  maxUsers: joi.number().integer().min(1),
  description: joi.string().max(500),
  isActive: joi.boolean().default(true),
})

// Update plan validation (for admin)
const updatePlanVal = joi.object({
  name: joi.string().min(3).max(50),
  price: joi.number().min(0),
  features: joi.array().items(joi.string()).min(1),
  recommended: joi.boolean(),
  trialDays: joi.number().integer().min(0).max(30),
  maxUsers: joi.number().integer().min(1),
  description: joi.string().max(500),
  isActive: joi.boolean(),
})

// Plan ID params validation
const planIdVal = joi.object({
  planId: joi.string().required(),
})

// Validation schemas
export {
  getPlansVal,
  getStatusVal,
  subscribeVal,
  upgradeVal,
  cancelVal,
  initializeTrialVal,
  createPlanVal,
  updatePlanVal,
  planIdVal,
}
