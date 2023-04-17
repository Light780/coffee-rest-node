import { Schema, model } from 'mongoose'

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'name is required']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  img: {
    type: String
  },
  role: {
    type: String,
    required: [true, 'role is required'],
    enum: ['ADMIN_ROLE', 'USER_ROLE']
  },
  state: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
})

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject()
  user.uid = _id
  return user
}

export default model('User', UserSchema)
