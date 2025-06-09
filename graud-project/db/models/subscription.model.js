import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'trial', 'cancelled', 'expired', 'upgraded'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    amount: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
      unique: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    trialDays: {
      type: Number,
      default: 0,
    },
    paymentDetails: {
      transactionId: String,
      paymentMethod: String,
      paymentDate: Date,
      currency: {
        type: String,
        default: 'EGP',
      },
      status: String,
      amount: Number,
    },
    cancelledAt: {
      type: Date,
    },
    previousTrialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    trialUpgraded: {
      type: Boolean,
      default: false,
    },
    lastPaymentDate: {
      type: Date,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    nextBillingDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better query performance
subscriptionSchema.index({ userId: 1, status: 1 })
subscriptionSchema.index({ orderId: 1 })
subscriptionSchema.index({ status: 1, endDate: 1 })

// Virtual for checking if subscription is active
subscriptionSchema.virtual('isActive').get(function () {
  return this.status === 'active' && this.endDate > new Date()
})

// Virtual for checking if trial is active
subscriptionSchema.virtual('isTrialActive').get(function () {
  return this.status === 'trial' && this.endDate > new Date()
})

// Method to check if subscription is expired
subscriptionSchema.methods.isExpired = function () {
  return this.endDate < new Date()
}

// Method to calculate days remaining
subscriptionSchema.methods.getDaysRemaining = function () {
  const now = new Date()
  if (this.endDate < now) return 0
  return Math.ceil((this.endDate - now) / (1000 * 60 * 60 * 24))
}

// Pre-save middleware to handle subscription status
subscriptionSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'active') {
    this.lastPaymentDate = new Date()
  }
  next()
})

// Static method to find active subscriptions
subscriptionSchema.statics.findActive = function () {
  return this.find({
    status: 'active',
    endDate: { $gt: new Date() },
  })
}

// Static method to find active trials
subscriptionSchema.statics.findActiveTrials = function () {
  return this.find({
    status: 'trial',
    endDate: { $gt: new Date() },
  })
}

export const subscriptionModel = mongoose.model(
  'Subscription',
  subscriptionSchema
)
