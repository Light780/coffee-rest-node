import { Schema, model } from 'mongoose'

const Product = Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    unique: true
  },
  state: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: {
    type: String
  },
  available: {
    type: Boolean,
    default: true
  },
  img: {
    type: String
  }
})

Product.methods.toJSON = function () {
  const { __v, state, ...data } = this.toObject()
  return data
}

export default model('Product', Product)
