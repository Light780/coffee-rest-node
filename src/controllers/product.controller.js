import { request, response } from 'express'
import Product from '../models/product.js'

export const getProducts = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query
  const [data, totalRecords] = await Promise.all([
    Product.find()
      .skip(from)
      .limit(limit)
      .populate('user', { _id: 1, name: 1 })
      .populate('category', { _id: 1, name: 1 }),
    Product.countDocuments()
  ])

  res.json({
    data,
    totalRecords
  })
}

export const getProduct = async (req = request, res = response) => {
  const { id } = req.params

  const product = await Product.findById(id)
    .populate('user', { _id: 1, name: 1 })
    .populate('category', { _id: 1, name: 1 })

  res.json(product)
}

export const createProduct = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase()
  const { price = 0, category, description, available = true, img } = req.body

  const productDB = await Product.findOne({ name })

  if (productDB) {
    return res.status(400).json({
      msg: `Product '${productDB.name}' already exists`
    })
  }

  const data = {
    name,
    price,
    category,
    description,
    available,
    img,
    user: req.user._id
  }

  const product = new Product(data)
  await product.save()

  res.json(product)
}

export const updateProduct = async (req = request, res = response) => {
  const { id } = req.params
  const name = req.body.name.toUpperCase()
  const { price = 0, category, description, available = true, img } = req.body

  const data = {
    name,
    price,
    category,
    description,
    available,
    img,
    user: req.user._id
  }

  const product = await Product.findByIdAndUpdate(id, data, { new: true })

  res.json(product)
}

export const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params

  const product = await Product.findByIdAndUpdate(id, { state: false }, { new: true })

  res.json(product)
}
