import { subscriptionPlanModel } from '../../../db/models/subcription-plan.model.js'
import { userModel } from '../../../db/models/user.model.js'
import { catchError } from '../../middleware/catchError.js'
import { appError } from '../../utils/appError.js'
import { paymobService } from '../../services/payment/paymob.service.js'
import dotenv from 'dotenv'
dotenv.config()

export const PaymentController = {
  initiatePayment: catchError(async (req, res) => {
    const { planId } = req.body
    const user = req.user

    const plan = await subscriptionPlanModel.findOne({
      _id: planId,
      isActive: true,
    })

    if (!plan) {
      throw new appError(
        'Subscription plan not found or inactive',
        404,
        'PLAN_NOT_FOUND'
      )
    }

    const amount = plan.price // safer than trusting client input

    const order = await paymobService.createOrder(amount)
    const paymentKey = await paymobService.getPaymentKey(
      order,
      process.env.PAYMOB_INTEGRATION_ID,
      {
        email: user.email,
        name: user.name,
        phone: user.phone,
      }
    )
    await userModel.findByIdAndUpdate(user._id, {
      subscription: plan._id,
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      paymentStatus: 'completed',
      orderId: order.id,
      paymentToken: paymentKey.token,
    })

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey.token}`

    res.status(200).json({
      success: true,
      data: {
        iframeUrl,
        orderId: order.id,
        paymentToken: paymentKey.token,
      },
    })
  }),

  getPaymentStatus: catchError(async (req, res) => {
    const { orderId } = req.params

    const subscription = await Subscription.findOne({ orderId }).populate(
      'planId',
      'name price features'
    )

    if (!subscription) {
      throw new appError('Order not found', 404, 'ORDER_NOT_FOUND')
    }

    res.status(200).json({
      success: true,
      data: {
        status: subscription.paymentStatus,
        subscriptionStatus: subscription.status,
        plan: subscription.planId,
        amount: subscription.amount,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        paymentDetails: subscription.paymentDetails,
      },
    })
  }),

  getPlans: catchError(async (req, res) => {
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
}
