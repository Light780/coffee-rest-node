import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Successfully Connected')
  } catch (error) {
    console.log('Error while trying to connect to MongoDB', error)
  }
}
