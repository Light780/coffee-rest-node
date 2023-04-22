import { Router } from 'express'
import { showImage, updateImageCloudinary, uploadFile } from '../controllers/upload.controller.js'
import { check } from 'express-validator'
import { validateFields } from '../middlewares/validate-fields.js'
import { validateAllowedCollections } from '../helpers/db-validators.js'
import { validateFile } from '../middlewares/validate-file.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const uploadRouter = Router()

uploadRouter.post('/', [
  validateJwt,
  validateFile
], uploadFile)

uploadRouter.put('/:collection/:id', [
  validateJwt,
  validateFile,
  check('id', 'id must be a valid identifier').isMongoId(),
  check('collection').custom(c => validateAllowedCollections(c, ['users', 'products'])),
  validateFields
], updateImageCloudinary)

uploadRouter.get('/:collection/:id', [
  validateJwt,
  check('id', 'id must be a valid identifier').isMongoId(),
  check('collection').custom(c => validateAllowedCollections(c, ['users', 'products'])),
  validateFields
], showImage)

export default uploadRouter
