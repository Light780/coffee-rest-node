import Role from '../models/role.js'
import User from '../models/user.js'

export const isValidRole = async (role = '') => {
  const existsRole = await Role.find({ role })
  if (!existsRole) {
    throw new Error(`role with name: ${role} does not exist`)
  }
}

export const existsEmial = async (email) => {
  const existsEmail = await User.findOne({ email })
  if (existsEmail) {
    throw new Error(`the email: ${email} already exists`)
  }
}

export const existsUserById = async (id) => {
  const existsUser = await User.findById(id)
  if (!existsUser) {
    throw new Error(`the user with id: ${id} does not exist`)
  }
}
