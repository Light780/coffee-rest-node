import { Router } from 'express'
import { validateJwt } from '../middlewares/index.js'
import { search } from '../controllers/search.controller.js'

const searchRouter = Router()

searchRouter.get('/:collection/:term', [validateJwt], search)

export default searchRouter
