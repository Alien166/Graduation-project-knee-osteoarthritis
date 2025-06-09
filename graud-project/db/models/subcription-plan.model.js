import mongoose from 'mongoose'

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    recommended: {
      type: Boolean,
      default: false,
    },
    trialDays: {
      type: Number,
      default: 14,
      min: 0,
      max: 30,
    },
    maxUsers: {
      type: Number,
      min: 1,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export const subscriptionPlanModel = mongoose.model(
  'SubscriptionPlan',
  subscriptionPlanSchema
)
