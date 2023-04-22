import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { request, response } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { uploadFileHelper } from '../helpers/upload-file.js'
import { Product, User } from '../models/index.js'

cloudinary.config(process.env.CLOUDINARY_URL)

export const uploadFile = async (req = request, res = response) => {
  try {
    const name = await uploadFileHelper(req.files)
    res.json({ name })
  } catch (error) {
    res.status(400).json(error)
  }
}

export const updateImage = async (req = request, res = response) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const { collection, id } = req.params

  let model

  switch (collection) {
    case 'users':
      model = await User.findById(id)
      if (!model) {
        return res.json({
          msg: `the user with id: ${id} does not exist`
        })
      }
      break

    case 'products':
      model = await Product.findById(id)
      if (!model) {
        return res.json({
          msg: `the product with id: ${id} does not exist`
        })
      }
      break

    default:
      return res.status(500).json({
        msg: 'In development'
      })
  }

  if (model.img) {
    const pathImage = path.join(__dirname, '../uploads', collection, model.img)
    if (fs.existsSync(pathImage)) fs.unlinkSync(pathImage)
  }

  const name = await uploadFileHelper(req.files, undefined, collection)
  model.img = name

  await model.save()

  res.json(model)
}

export const updateImageCloudinary = async (req = request, res = response) => {
  const { collection, id } = req.params

  let model

  switch (collection) {
    case 'users':
      model = await User.findById(id)
      if (!model) {
        return res.json({
          msg: `the user with id: ${id} does not exist`
        })
      }
      break

    case 'products':
      model = await Product.findById(id)
      if (!model) {
        return res.json({
          msg: `the product with id: ${id} does not exist`
        })
      }
      break

    default:
      return res.status(500).json({
        msg: 'In development'
      })
  }

  if (model.img) {
    const arrName = model.img.split('/')
    const name = arrName.pop()
    const [publicId] = name.split('.')
    await cloudinary.uploader.destroy(publicId)
  }

  const { tempFilePath } = req.files.file

  /* eslint-disable camelcase */
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
  model.img = secure_url
  /* eslint-enable camelcase */

  await model.save()

  res.json(model)
}

export const showImage = async (req = request, res = response) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const tempImage = path.join(__dirname, '../assets', 'noimage-220518-150756.jpg')
  const { collection, id } = req.params

  let model

  switch (collection) {
    case 'users':
      model = await User.findById(id)
      if (!model) {
        return res.json({
          msg: `the user with id: ${id} does not exist`
        })
      }
      break

    case 'products':
      model = await Product.findById(id)
      if (!model) {
        return res.json({
          msg: `the product with id: ${id} does not exist`
        })
      }
      break

    default:
      return res.status(500).json({
        msg: 'In development'
      })
  }

  if (model.img) {
    const pathImage = path.join(__dirname, '../uploads', collection, model.img)
    if (fs.existsSync(pathImage)) return res.sendFile(pathImage)
  }

  res.sendFile(tempImage)
}
