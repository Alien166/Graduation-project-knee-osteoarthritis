import express from 'express'
import { validation } from '../../middleware/validation.js'
import { checkEmail } from '../../middleware/checkEmail.js'
import { changePassword, checkCode, forgetPassword, isVerify, protectedRoutes, resetPassword, signin, signup } from './controller/auth.controller.js'
import { changePasswordVal, checkCodeVal, forgetPasswordVal, isverifyVal, resetPasswordVal, signinVal, signupVal } from './auth.validation.js'


const authRouter = express.Router()

authRouter.post('/signup', validation(signupVal), checkEmail, signup)
authRouter.post('/signin', validation(signinVal), signin)
authRouter.patch('/changepassword',protectedRoutes, validation(changePasswordVal), changePassword)
authRouter.get('/verification', protectedRoutes, validation(isverifyVal), isVerify)


authRouter.post('/forgetPassword', validation(forgetPasswordVal), forgetPassword)
authRouter.post('/checkCode', validation(checkCodeVal), checkCode)
authRouter.post('/resetPassword', validation(resetPasswordVal), resetPassword)

export default authRouter