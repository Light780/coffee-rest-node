import express from 'express'
import { deleteUser, getUser, createUser, updateUser } from '../controllers/user.controller.js'
import { check } from 'express-validator'
import { existsEmail, existsUserById, isValidRole } from '../helpers/db-validators.js'
import { validateFields, validateJwt, validateRoles } from '../middlewares/index.js'
const userRouter = express.Router()

userRouter.get('/', [validateJwt], getUser)

userRouter.post('/', [
  check('name', 'name is required').notEmpty(),
  check('email', 'email is not valid').isEmail(),
  check('email').custom(existsEmail),
  check('password', 'password must contain more than 6 characters').isLength({ min: 6 }),
  check('role', 'is not a valid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('role').custom(isValidRole),
  validateFields
], createUser)

userRouter.put('/:id', [
  validateJwt,
  check('id', 'is not a valid identifier').isMongoId(),
  check('id').custom(existsUserById),
  check('role', 'is not a valid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('role').custom(isValidRole),
  validateFields
], updateUser)

userRouter.delete('/:id', [
  validateJwt,
  validateRoles('ADMIN_ROLE'),
  check('id', 'is not a valid identifier').isMongoId(),
  check('id').custom(existsUserById),
  validateFields
], deleteUser)

export default userRouter
