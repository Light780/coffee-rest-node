import { Router } from 'express'
import { authLogin } from '../controllers/auth.controller.js'
import { check } from 'express-validator'
import { validateFields } from '../middlewares/validate-fields.js'

const authRouter = Router()

authRouter.post('/login', [
  check('email', 'email is not valid').isEmail(),
  check('password', 'password is required').notEmpty(),
  validateFields
], authLogin)

export default authRouter
