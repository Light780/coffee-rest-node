import { Router } from 'express'
import { validateFields, validateJwt, validateRoles } from '../middlewares/index.js'
import { check } from 'express-validator'
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/category.controller.js'
import { existsProduct } from '../helpers/db-validators.js'

const categoryRouter = Router()

categoryRouter.get('/', [validateJwt], getCategories)

categoryRouter.get('/:id', [
  validateJwt,
  check('id', 'is not a valid identifier').isMongoId(),
  validateFields
], getCategory)

categoryRouter.post('/', [
  validateJwt,
  check('name', 'name is required').notEmpty(),
  validateFields
], createCategory)

categoryRouter.put('/:id', [
  validateJwt,
  check('id', 'is not a valid id').isMongoId(),
  check('id').custom(existsProduct),
  check('name', 'name is required').notEmpty(),
  validateFields
], updateCategory)

categoryRouter.delete('/:id', [
  validateJwt,
  validateRoles('ADMIN_ROLE'),
  check('id', 'is not a valid identifier').isMongoId(),
  check('id').custom(existsProduct)
], deleteCategory)

export default categoryRouter
