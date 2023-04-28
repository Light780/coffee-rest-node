import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

export const generateJwt = (uid) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ uid }, process.env.JWT_SECRET_KEY, { algorithm: 'HS512', expiresIn: '2h' }, (err, token) => {
      if (err) {
        reject(new Error('Error while generating token'))
      } else {
        resolve(token)
      }
    })
  })
}

export const validateJwtSocket = async (token = '') => {
  try {
    if (token.length <= 10) {
      return null
    }

    const { uid } = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const user = await User.findById(uid)

    if (user && user.state) return user

    return null
  } catch (error) {
    return null
  }
}
