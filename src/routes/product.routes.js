import { Router } from 'express'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/product.controller.js'
import { check } from 'express-validator'
import { existsCategory, existsProduct } from '../helpers/db-validators.js'
import { validateFields, validateRoles, validateJwt } from '../middlewares/index.js'

const productRouter = Router()

productRouter.get('/', [validateJwt], getProducts)

productRouter.get('/:id', [validateJwt], getProduct)

productRouter.post('/', [
  validateJwt,
  check('name', 'name is required').notEmpty(),
  check('category', 'category is not a valid identifier').isMongoId(),
  check('category').custom(existsCategory),
  validateFields
], createProduct)

productRouter.put('/:id', [
  validateJwt,
  check('id', 'id is not a valid identifier').isMongoId(),
  check('id').custom(existsProduct),
  check('name', 'name is required').notEmpty(),
  check('category', 'category is not a valid id').isMongoId(),
  check('category').custom(existsCategory),
  validateFields
], updateProduct)

productRouter.delete('/:id', [
  validateJwt,
  validateRoles('ADMIN_ROLE'),
  check('id', 'id is not a valid identifier').isMongoId(),
  check('id').custom(existsProduct),
  validateFields
], deleteProduct)

export default productRouter
