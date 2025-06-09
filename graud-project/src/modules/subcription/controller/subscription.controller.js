import { subscriptionPlanModel } from '../../../../db/models/subcription-plan.model.js'
import { userModel } from '../../../../db/models/user.model.js'
import { catchError } from '../../../middleware/catchError.js'
import { appError } from '../../../utils/appError.js'

export const subscriptionController = {
  // Get all available subscription plans
  getPlans: catchError(async (req, res, next) => {
    const plans = await subscriptionPlanModel.find().sort({ price: 1 })
    res.status(200).json({
      status: 'success',
      data: plans,
    })
  }),

  getSubscriptionStatus: catchError(async (req, res, next) => {
    const user = await userModel
      .findById(req.user._id)
      .populate('subscription')
      .select('-password -verifyCode -resetCode')

    if (!user) {
      return next(new appError('User not found', 404))
    }

    const today = new Date()

    const subscriptionDaysLeft =
      user.subscriptionEndDate && today <= user.subscriptionEndDate
        ? Math.ceil((user.subscriptionEndDate - today) / (1000 * 60 * 60 * 24))
        : 0

    const status = {
      isTrialActive: user.isTrialActive,
      trialDaysLeft: user.trialDaysLeft,
      isSubscribed: user.isSubscribed,
      subscriptionPlan: user.subscription || null,
      subscriptionStatus: user.subscriptionStatus,
      hasUsedTrial: user.hasUsedTrial,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
      subscriptionDaysLeft,
      trialStartDate: user.trialStartDate,
      trialEndDate: user.trialEndDate,
    }

    res.status(200).json({
      status: 'success',
      data: status,
    })
  }),

  // Subscribe to a plan
  subscribeToPlan: catchError(async (req, res, next) => {
    const { planId } = req.body

    // Validate plan exists
    const plan = await subscriptionPlanModel.findById(planId)
    if (!plan) {
      return next(new appError('Subscription plan not found', 404))
    }

    const user = await userModel.findById(req.user._id)
    if (!user) {
      return next(new appError('User not found', 404))
    }

    // Check if user already has an active subscription
    if (user.isSubscribed) {
      return next(
        new appError(
          'You already have an active subscription. Please cancel it first.',
          400
        )
      )
    }

    // Update user's subscription
    user.subscription = planId
    user.subscriptionStatus = 'active'
    user.subscriptionStartDate = new Date()
    user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    await user.save()

    res.status(200).json({
      status: 'success',
      message: 'Successfully subscribed to plan',
      data: {
        plan: plan,
        subscriptionEndDate: user.subscriptionEndDate,
      },
    })
  }),

  // Cancel subscription
  cancelSubscription: catchError(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (!user) {
      return next(new appError('User not found', 404))
    }

    if (!user.isSubscribed) {
      return next(
        new appError('You do not have an active subscription to cancel', 400)
      )
    }

    user.subscriptionStatus = 'expired'
    await user.save()

    res.status(200).json({
      status: 'success',
      message: 'Subscription cancelled successfully',
    })
  }),

  // Initialize trial for new user
  initializeTrial: catchError(async (req, res, next) => {
    const { planId } = req.body

    const user = await userModel.findById(req.user._id)
    if (!user) {
      return next(new appError('User not found', 404))
    }

    if (user.hasUsedTrial) {
      return next(new appError('You have already used your trial period', 400))
    }

    if (user.isSubscribed) {
      return next(
        new appError(
          'You already have an active subscription. No trial needed.',
          400
        )
      )
    }

    // Get the selected plan by ID
    const plan = await subscriptionPlanModel.findById(planId)
    if (!plan) {
      return next(new appError('Subscription plan not found', 404))
    }

    // Use the plan's trialDays if defined, otherwise default to 14
    const trialDurationDays = plan.trialDays ?? 14

    // Initialize trial
    user.subscription = plan._id
    user.subscriptionStatus = 'trial'
    user.trialStartDate = new Date()
    user.trialEndDate = new Date(
      Date.now() + trialDurationDays * 24 * 60 * 60 * 1000
    )
    user.hasUsedTrial = true

    await user.save()

    res.status(200).json({
      status: 'success',
      message: 'Trial initialized successfully',
      data: {
        plan,
        trialEndDate: user.trialEndDate,
      },
    })
  }),

  // Upgrade subscription plan
  upgradePlan: catchError(async (req, res, next) => {
    const { planId } = req.body

    // Validate plan exists
    const newPlan = await subscriptionPlanModel.findById(planId)
    if (!newPlan) {
      return next(new appError('Subscription plan not found', 404))
    }

    const user = await userModel.findById(req.user._id).populate('subscription')
    if (!user) {
      return next(new appError('User not found', 404))
    }

    if (!user.isSubscribed) {
      return next(
        new appError('You must have an active subscription to upgrade', 400)
      )
    }

    // Check if trying to upgrade to same plan
    if (user.subscription._id.toString() === planId) {
      return next(new appError('You are already subscribed to this plan', 400))
    }

    // Update subscription
    user.subscription = planId
    user.subscriptionStartDate = new Date()
    user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    await user.save()

    res.status(200).json({
      status: 'success',
      message: 'Successfully upgraded subscription plan',
      data: {
        plan: newPlan,
        subscriptionEndDate: user.subscriptionEndDate,
      },
    })
  }),

  // Create a new subscription plan (admin use)
  createPlan: catchError(async (req, res, next) => {
    const {
      name,
      price,
      features,
      recommended = false,
      trialDays = 14,
      maxUsers,
      description,
      isActive = true,
    } = req.body

    // Check if a plan with the same name already exists
    const existingPlan = await subscriptionPlanModel.findOne({ name })
    if (existingPlan) {
      return next(new appError('A plan with this name already exists', 400))
    }

    const newPlan = await subscriptionPlanModel.create({
      name,
      price,
      features,
      recommended,
      trialDays,
      maxUsers,
      description,
      isActive,
    })

    res.status(201).json({
      status: 'success',
      message: 'Subscription plan created successfully',
      data: newPlan,
    })
  }),
}
