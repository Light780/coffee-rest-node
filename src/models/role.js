import { Schema, model } from 'mongoose'

const RoleSchema = Schema({
  role: {
    type: String,
    required: [true, 'role is required']
  }
})

export default model('role', RoleSchema)
