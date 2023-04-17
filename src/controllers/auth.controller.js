import { response, request } from 'express'
import bcryptjs from 'bcryptjs'
import User from '../models/user.js'
import { generateJwt } from '../helpers/jwt.js'

export const authLogin = async (req = request, res = response) => {
  const { email, password } = req.body
  const BAD_CREDENTIALS = 'Bad Credentials'

  try {
    const user = await User.findOne({ email })
    if (!user || !user.state) {
      return res.status(400).json({
        msg: BAD_CREDENTIALS
      })
    }

    const isValidPassword = bcryptjs.compareSync(password, user.password)

    if (!isValidPassword) {
      return res.status(400).json({
        msg: BAD_CREDENTIALS
      })
    }

    const token = await generateJwt(user.id)
    res.json({
      ...user,
      token
    })
  } catch (error) {
    return res.status(500).json({
      msg: BAD_CREDENTIALS
    })
  }
}
