import { request, response } from 'express'
import { Types } from 'mongoose'
import { Category, Product, User } from '../models/index.js'

const allowedCollections = [
  'users',
  'categories',
  'products',
  'roles'
]

const searchUsers = async (term = '', res = response) => {
  const isMongoId = Types.ObjectId.isValid(term)

  if (isMongoId) {
    const user = await User.findById(term)
    return res.json({
      data: user ? [user] : []
    })
  }

  const regex = new RegExp(term, 'i')

  const data = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }]
  })

  res.json({
    data
  })
}

const searchCategories = async (term = '', res = response) => {
  const isMongoId = Types.ObjectId.isValid(term)

  if (isMongoId) {
    const category = await Category.findById(term)
      .populate('user', { _id: 1, name: 1 })

    return res.json({
      data: category ? [category] : []
    })
  }

  const regex = new RegExp(term, 'i')

  const data = await Category.find({ name: regex, state: true })
    .populate('user', { _id: 1, name: 1 })

  res.json({
    data
  })
}

const searchProducts = async (term = '', res = response) => {
  const isMongoId = Types.ObjectId.isValid(term)

  if (isMongoId) {
    const product = await Product.findById(term)
      .populate('user', { _id: 1, name: 1 })
      .populate('category', { _id: 1, name: 1 })

    return res.json({
      data: product ? [product] : []
    })
  }

  const regex = new RegExp(term, 'i')

  const data = await Product.find({ name: regex, state: true })
    .populate('user', { _id: 1, name: 1 })
    .populate('category', { _id: 1, name: 1 })

  res.json({
    data
  })
}

export const search = async (req = request, res = response) => {
  const { collection, term } = req.params

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `The allowed collection are: ${allowedCollections}`
    })
  }

  switch (collection) {
    case 'users':
      searchUsers(term, res)
      break

    case 'products':
      searchProducts(term, res)
      break

    case 'categories':
      searchCategories(term, res)
      break

    default:
      res.status(500).json({
        msg: 'In development'
      })
      break
  }
}
