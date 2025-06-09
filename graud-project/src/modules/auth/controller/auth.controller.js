import { catchError } from '../../../middleware/catchError.js'
import { appError } from '../../../utils/appError.js'
import { userModel } from '../../../../db/models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../../../services/email/sendEmail.js'
import { nanoid } from 'nanoid'

const signup = catchError(async (req, res, next) => {
  let Code = nanoid(6)
  req.body.verifyCode = Code
  let user = new userModel(req.body)
  await user.save()
  let token = jwt.sign(
    {
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      role: user.role,
    },
    process.env.JWT_KEY
  )
  sendEmail(Code, req.body.email)
  !user && next(new appError('invalid data', 404))
  user && res.send({ message: 'success', user, token })
})

const signin = catchError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email })
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    let token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
        userName: user.name,
        role: user.role,
      },
      process.env.JWT_KEY
    )
    return res.json({ message: 'success', token })
  }
  next(new appError('Incorrect email or password', 401))
})
const isVerify = catchError(async (req, res, next) => {
  let verify = await userModel.findOne({
    _id: req.user._id,
    verifyCode: req.body.code,
  })
  if (!verify) return next(new appError('code invalid', 401))
  let verified = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { isverify: true }
  )
  if (!verified) return next(new appError('verify faild', 401))
  res.send({ message: 'success' })
})

const changePassword = catchError(async (req, res, next) => {
  let { oldPassword, newPassword } = req.body
  if (bcrypt.compareSync(oldPassword, req.user.password)) {
    await userModel.findByIdAndUpdate(req.user._id, {
      password: newPassword,
      passwordChangedAt: Date.now(),
    })
    let token = jwt.sign(
      {
        userId: req.user._id,
        userEmail: req.user.email,
        userName: req.user.name,
        role: req.user.role,
      },
      process.env.SECERET_KEY
    )
    return res.send({ message: 'success', token })
  }
})

const forgetPassword = catchError(async (req, res, next) => {
  let { email } = req.body
  let user = await userModel.findOne({ email })
  if (!user) return next(new appError('no account for this email', 401))
  let resetCode = nanoid(6)
  await userModel.findOneAndUpdate({ email }, { resetCode })
  sendEmail(resetCode, email)
  res.send({ message: 'success' })
})

const checkCode = catchError(async (req, res, next) => {
  let { email, code } = req.body
  let verify = await userModel.findOne({ email: email, resetCode: code })
  if (!verify) return next(new appError('code invalid', 401))
  res.send({ message: 'success' })
})

const resetPassword = catchError(async (req, res, next) => {
  let user = await userModel.findOneAndUpdate(
    { email: req.body.email },
    { password: req.body.newPassword, passwordChangedAt: Date.now() }
  )

  let token = jwt.sign(
    {
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      role: user.role,
    },
    process.env.JWT_KEY
  )
  res.send({ message: 'success', token })
})

const protectedRoutes = catchError(async (req, res, next) => {
  let token
  // Check Authorization header
  const authHeader = req.headers.token || req.headers.Token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
    console.log('Token from Authorization:', token)
  }

  // Check custom token header (case insensitive)
  if (!token) {
    token = req.headers.token || req.headers.Token
    console.log('Token from custom header:', token)
  }

  if (!token) {
    console.log('No token found in headers')
    return next(new appError('Token is not provided', 401))
  }

  try {
    let decoded = jwt.verify(token, process.env.JWT_KEY)
    if (!decoded) return next(new appError('invalid decoded', 401))

    let user = await userModel.findById(decoded.userId)
    if (!user) return next(new appError('User not founded login again', 404))

    if (user.passwordChangedAt) {
      let time = parseInt(user?.passwordChangedAt.getTime() / 1000)
      if (time > decoded.iat)
        return next(new appError('invalid token, login again!', 401))
    }

    req.user = user
    next()
  } catch (error) {
    console.log('Token verification error:', error.message)
    return next(new appError('Invalid token', 401))
  }
})

function allowedTo(...roles) {
  return catchError(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new appError('You Are Not allowed', 401))
    next()
  })
}

export {
  signup,
  signin,
  protectedRoutes,
  changePassword,
  allowedTo,
  isVerify,
  forgetPassword,
  checkCode,
  resetPassword,
}
