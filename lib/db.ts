import mongoose from 'mongoose'

/**
 * MongoDB database connection and User model
 */

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ooumph-tools'

// Connection state
let isConnected = false

/**
 * Connect to MongoDB database
 * Uses connection pooling and handles reconnection automatically
 */
export async function connectToDatabase() {
  if (isConnected) {
    return
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    isConnected = db.connections[0].readyState === 1
    console.log('[DB] Connected to MongoDB successfully')
  } catch (error) {
    console.error('[DB] MongoDB connection error:', error)
    throw new Error('Failed to connect to database')
  }
}

// User interface for TypeScript
export interface User {
  id: string
  email: string
  name: string
  password: string // hashed password
  createdAt: Date
  updatedAt: Date
}

// Mongoose Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Create or retrieve existing model
const UserModel = mongoose.models.User || mongoose.model('User', userSchema)

/**
 * Convert Mongoose document to User interface
 */
function toUser(doc: any): User {
  return {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name,
    password: doc.password,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export const db = {
  users: {
    findByEmail: async (email: string): Promise<User | null> => {
      await connectToDatabase()
      const user = await UserModel.findOne({ email: email.toLowerCase() }).lean()
      return user ? toUser(user) : null
    },

    findById: async (id: string): Promise<User | null> => {
      await connectToDatabase()
      
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null
      }
      
      const user = await UserModel.findById(id).lean()
      return user ? toUser(user) : null
    },

    create: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
      await connectToDatabase()
      
      const user = await UserModel.create({
        email: userData.email.toLowerCase(),
        name: userData.name,
        password: userData.password,
      })

      return toUser(user)
    },

    update: async (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> => {
      await connectToDatabase()
      
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null
      }

      const user = await UserModel.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      ).lean()

      return user ? toUser(user) : null
    },

    delete: async (id: string): Promise<boolean> => {
      await connectToDatabase()
      
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return false
      }

      const result = await UserModel.findByIdAndDelete(id)
      return result !== null
    },

    // For development/testing only
    getAll: async (): Promise<User[]> => {
      await connectToDatabase()
      const users = await UserModel.find().lean()
      return users.map(toUser)
    },
  },
}
