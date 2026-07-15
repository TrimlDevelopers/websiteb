import mongoose from 'mongoose'

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI?.trim()

  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables.')
  }

  mongoose.set('strictQuery', true)

  await mongoose.connect(uri)
  console.log('[db] Connected to MongoDB Atlas')
}
