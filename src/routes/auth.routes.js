import { Router } from 'express'
import { authLogin, authGoogleSignIn, renewToken } from '../controllers/auth.controller.js'
import { check } from 'express-validator'
import { validateFields, validateJwt } from '../middlewares/index.js'

const authRouter = Router()

authRouter.post('/login', [
  check('email', 'email is not valid').isEmail(),
  check('password', 'password is required').notEmpty(),
  validateFields
], authLogin)

authRouter.post('/google', [
  check('idToken', 'id_token is required').notEmpty(),
  validateFields
], authGoogleSignIn)

authRouter.get('/', validateJwt, renewToken)

export default authRouter
