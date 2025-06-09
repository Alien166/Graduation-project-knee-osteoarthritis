import { userModel } from '../../db/models/user.model.js'
import { catchError } from '../middleware/catchError.js'
import { appError } from '../utils/appError.js'

const checkSubscription = catchError(async (req, res, next) => {
  const user = await userModel.findById(req.user._id)

  if (!user) {
    return next(new appError('User not found', 404))
  }

  // Check if user has active trial or subscription
  if (!user.isTrialActive && !user.isSubscribed) {
    return next(
      new appError(
        'Your trial has expired. Please subscribe to continue using this feature.',
        403
      )
    )
  }

  // Attach user info to request for use in route handlers
  req.user = user
  next()
})

export default checkSubscription
