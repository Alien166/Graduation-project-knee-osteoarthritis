import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: [3, 'User name is too short'],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: Date,
    verifyCode: String,
    resetCode: String,
    isverify: {
      type: Boolean,
      default: false,
    },

    // ✅ Added subscription reference
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      default: null,
    },
    orderId: {
      type: String,
      default: null,
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'expired', 'trial', 'none'],
      default: 'none',
    },
    subscriptionStartDate: {
      type: Date,
      default: null,
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentToken: {
      type: String,
      default: null,
    },
    trialStartDate: {
      type: Date,
      default: null,
    },
    trialEndDate: {
      type: Date,
      default: null,
    },
    hasUsedTrial: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ✅ Virtual: check if trial is active
schema.virtual('isTrialActive').get(function () {
  return this.trialEndDate && new Date() <= this.trialEndDate
})

// ✅ Virtual: trial days left
schema.virtual('trialDaysLeft').get(function () {
  if (!this.isTrialActive) return 0
  const daysLeft = Math.ceil(
    (this.trialEndDate - new Date()) / (1000 * 60 * 60 * 24)
  )
  return Math.max(0, daysLeft)
})

// ✅ Virtual: check if subscription is active
schema.virtual('isSubscribed').get(function () {
  return (
    this.subscriptionStatus === 'active' &&
    this.subscriptionStartDate &&
    this.subscriptionEndDate &&
    new Date() <= this.subscriptionEndDate
  )
})

// ✅ Hash password before saving
schema.pre('save', function () {
  if (this.password) {
    this.password = bcrypt.hashSync(this.password, 8)
  }
})

// ✅ Hash password before update
schema.pre('findOneAndUpdate', function () {
  if (this._update.password) {
    this._update.password = bcrypt.hashSync(this._update.password, 8)
  }
})

export const userModel = mongoose.model('user', schema)
