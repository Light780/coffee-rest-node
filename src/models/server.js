import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server as ServerSocket } from 'socket.io'
import { connectDB } from '../config/db.js'
import fileUpload from 'express-fileupload'
import {
  authRouter,
  userRouter,
  categoryRouter,
  productRouter,
  searchRouter,
  uploadRouter
} from '../routes/index.js'
import { socketController } from '../sockets/socket.controller.js'

class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT
    this.server = http.createServer(this.app)
    this.io = new ServerSocket(this.server)

    // Middlewares
    this.middlewares()

    // Routes
    this.routes()

    // Sockets
    this.sockets()
  }

  routes () {
    this.app.use('/api/auth', authRouter)
    this.app.use('/api/user', userRouter)
    this.app.use('/api/category', categoryRouter)
    this.app.use('/api/product', productRouter)
    this.app.use('/api/search', searchRouter)
    this.app.use('/api/upload', uploadRouter)
  }

  middlewares () {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.static('./src/public'))
    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true
    }))
  }

  sockets () {
    this.io.on('connection', (socket) => socketController(socket, this.io))
  }

  listen () {
    this.server.listen(this.port, async () => {
      await connectDB()
      console.log('Web Service running at port:', this.port)
    })
  }
}

export default Server
