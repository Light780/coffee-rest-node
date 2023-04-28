import { response, request } from 'express'
import bcryptjs from 'bcryptjs'
import User from '../models/user.js'
import { generateJwt } from '../helpers/jwt.js'
import { googleVerify } from '../helpers/google-verify.js'

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

    res.json({ user, token })
  } catch (error) {
    return res.status(500).json({
      msg: BAD_CREDENTIALS
    })
  }
}

export const authGoogleSignIn = async (req = request, res = response) => {
  const { idToken } = req.body
  try {
    const { email, name, picture } = await googleVerify(idToken)
    let user = await User.findOne({ email })

    if (!user) {
      const data = { email, name, img: picture, password: '3NCR1PT4D0', role: 'USER_ROLE' }
      user = new User(data)
      await user.save()
    }

    if (!user.state) {
      return res.status(401).json({
        msg: 'Unauthorized'
      })
    }

    const token = await generateJwt(user.id)

    res.json({ user, token })
  } catch (error) {
    res.status(500).json({
      msg: 'Error in Google SignIn'
    })
  }
}

export const renewToken = async (req = request, res = response) => {
  const { user } = req
  const token = await generateJwt(user.id)

  res.json({ user, token })
}
