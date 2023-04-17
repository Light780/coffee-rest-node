import { request, response } from 'express'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

export const validateJwt = async (req = request, res = response, next) => {
  const authorization = req.header('authorization')
  const ERR_AUTH = 'User not authenticated'

  if (!authorization) {
    return res.status(400).json({
      msg: ERR_AUTH
    })
  }

  const token = authorization[1]
  if (!token) {
    return res.status(400).json({
      msg: ERR_AUTH
    })
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const user = await User.findById(uid)

    if (!user.state) {
      return res.status(401).json({
        msg: 'Unauthorized'
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(400).json({
      msg: ERR_AUTH
    })
  }
}
