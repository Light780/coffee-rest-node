import jwt from 'jsonwebtoken'

export const generateJwt = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = uid
    const config = {
      algorithm: 'HS256',
      expiresIn: '1hr'
    }
    jwt.sign(payload, process.env.JWT_SECRET_KEY, config, (err, token) => {
      if (err) {
        reject(new Error('Error while generating token'))
      } else {
        resolve(token)
      }
    })
  })
}
