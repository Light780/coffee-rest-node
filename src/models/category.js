import { Schema, model } from 'mongoose'

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, 'name is required']
  },
  state: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

CategorySchema.methods.toJSON = function () {
  const { __v, ...category } = this.toObject()
  return category
}

export default model('Category', CategorySchema)
