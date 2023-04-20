import jwt from 'jsonwebtoken'

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
