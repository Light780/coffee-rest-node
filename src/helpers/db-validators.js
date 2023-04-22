import { Role, User, Category, Product } from '../models/index.js'

export const isValidRole = async (role) => {
  const existsRole = await Role.find({ role })
  if (!existsRole) {
    throw new Error(`role with name: ${role} does not exist`)
  }
}

export const existsEmail = async (email) => {
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

export const existsCategory = async (id) => {
  const existsCategory = await Category.findById(id)
  if (!existsCategory) {
    throw new Error(`the category with id: ${id} does not exist`)
  }
}

export const existsProduct = async (id) => {
  const existsProduct = await Product.findById(id)
  if (!existsProduct) {
    throw new Error(`the product with id: ${id} does not exist`)
  }
}

export const validateAllowedCollections = (collection, allowedCollections = []) => {
  if (!allowedCollections.includes(collection)) {
    throw new Error(`the collection ${collection} is not allowed. Allowed collections: ${allowedCollections}`)
  }
  return true
}
