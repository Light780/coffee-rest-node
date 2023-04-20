import { response, request } from 'express'
import bcryptjs from 'bcryptjs'
import User from '../models/user.js'

export const getUser = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query

  const [data, totalRecords] = await Promise.all([
    await User.find()
      .skip(from)
      .limit(limit),
    await User.countDocuments()
  ])

  res.json({
    data,
    totalRecords
  })
}

export const createUser = async (req = request, res = response) => {
  const { name, email, password, role } = req.body
  const user = new User({ name, email, password, role })

  // Encrypt passwrod
  const salt = bcryptjs.genSaltSync()
  user.password = bcryptjs.hashSync(password, salt)

  // Save
  await user.save()

  res.json(user)
}

export const updateUser = async (req = request, res = response) => {
  const { id } = req.params
  const { _id, password, google, email, ...userRequest } = req.body

  if (password) {
    const salt = bcryptjs.genSaltSync()
    userRequest.password = bcryptjs.hashSync(password, salt)
  }

  const user = await User.findByIdAndUpdate(id, userRequest, { new: true })

  res.json(user)
}

export const deleteUser = async (req = request, res = response) => {
  const { id } = req.params
  const user = await User.findByIdAndUpdate(id, { state: false }, { new: true })

  res.json(user)
}
