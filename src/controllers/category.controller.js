import { request, response } from 'express'
import Category from '../models/category.js'

export const getCategories = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query
  const [data, totalRecords] = await Promise.all([
    await Category.find()
      .skip(from)
      .limit(limit)
      .populate('user', { _id: 1, name: 1 }),
    await Category.countDocuments()
  ])

  res.json({
    data,
    totalRecords
  })
}

export const getCategory = async (req = request, res = response) => {
  const { id } = req.params

  const category = await Category.findById(id).populate('user', { _id: 1, name: 1 })

  res.json(category)
}

export const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase()

  const categoryDB = await Category.findOne({ name })

  if (categoryDB) {
    return res.status(400).json({
      msg: `Category '${categoryDB.name}' already exists`
    })
  }

  const data = {
    name,
    user: req.user._id
  }

  const category = new Category(data)
  await category.save()

  res.json(category)
}

export const updateCategory = async (req = request, res = response) => {
  const { id } = req.params
  const name = req.body.name.toUpperCase()

  const data = {
    name,
    user: req.user._id
  }

  const category = await Category.findByIdAndUpdate(id, data, { new: true })

  res.json(category)
}

export const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params

  const category = await Category.findByIdAndUpdate(id, { state: false }, { new: true })
  await category.save()

  res.json(category)
}
