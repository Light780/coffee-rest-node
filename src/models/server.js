import express from 'express'
import cors from 'cors'
import userRouter from '../routes/user.routes.js'
import { connectDB } from '../config/db.js'
import authRouter from '../routes/auth.routes.js'
import categoryRouter from '../routes/category.routes.js'
import productRouter from '../routes/product.routes.js'
import searchRouter from '../routes/search.routes.js'

class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT

    // Middlewares
    this.middlewares()

    // Routes
    this.routes()
  }

  routes () {
    this.app.use('/api/auth', authRouter)
    this.app.use('/api/user', userRouter)
    this.app.use('/api/category', categoryRouter)
    this.app.use('/api/product', productRouter)
    this.app.use('/api/search', searchRouter)
  }

  middlewares () {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.static('./src/public'))
  }

  listen () {
    this.app.listen(this.port, async () => {
      await connectDB()
      console.log('Web Service running at port:', this.port)
    })
  }
}

export default Server
