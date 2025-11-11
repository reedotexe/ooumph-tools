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

// User Profile interface for onboarding data
export interface UserProfile {
  // Company/Business Information
  companyName: string
  brandName?: string
  businessDescription: string
  industry: string
  website?: string
  
  // Target Audience
  targetAudience: string
  customerDemographics?: string
  
  // Business Strategy
  monetizationApproach?: string
  valueProposition?: string
  competitors?: string
  
  // Brand Identity
  brandVoice?: string
  brandValues?: string
  brandMission?: string
  brandVision?: string
  
  // Marketing
  platformPreferences?: string
  contentGoals?: string
  
  // Additional
  additionalInfo?: string
  constraints?: string
  
  // Onboarding status
  onboardingCompleted: boolean
}

// User interface for TypeScript
export interface User {
  id: string
  email: string
  name: string
  password: string // hashed password
  profile?: UserProfile
  createdAt: Date
  updatedAt: Date
}

// Mongoose Schema
const userProfileSchema = new mongoose.Schema({
  // Company/Business Information
  companyName: { type: String },
  brandName: { type: String },
  businessDescription: { type: String },
  industry: { type: String },
  website: { type: String },
  
  // Target Audience
  targetAudience: { type: String },
  customerDemographics: { type: String },
  
  // Business Strategy
  monetizationApproach: { type: String },
  valueProposition: { type: String },
  competitors: { type: String },
  
  // Brand Identity
  brandVoice: { type: String },
  brandValues: { type: String },
  brandMission: { type: String },
  brandVision: { type: String },
  
  // Marketing
  platformPreferences: { type: String },
  contentGoals: { type: String },
  
  // Additional
  additionalInfo: { type: String },
  constraints: { type: String },
  
  // Onboarding status
  onboardingCompleted: { type: Boolean, default: false },
}, { _id: false })

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
    profile: {
      type: userProfileSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Create or retrieve existing model
// Delete the existing model to ensure schema changes are applied
if (mongoose.models.User) {
  delete mongoose.models.User
}
const UserModel = mongoose.model('User', userSchema)

/**
 * Convert Mongoose document to User interface
 */
function toUser(doc: any): User {
  return {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name,
    password: doc.password,
    profile: doc.profile || undefined,
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
      
      console.log('[DB] Updating user:', id)
      console.log('[DB] Updates:', JSON.stringify(updates, null, 2))
      
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('[DB] Invalid ObjectId format:', id)
        return null
      }

      try {
        console.log('[DB] About to update with $set operator')
        
        // Use findById first, then update and save
        const existingUser = await UserModel.findById(id)
        
        if (!existingUser) {
          console.log('[DB] User not found')
          return null
        }
        
        console.log('[DB] Found existing user, applying updates...')
        
        // Apply updates directly to the document
        Object.keys(updates).forEach(key => {
          (existingUser as any)[key] = (updates as any)[key]
        })
        
        // Save the document
        const savedUser = await existingUser.save()
        const leanUser = savedUser.toObject()
        
        console.log('[DB] User saved successfully')
        console.log('[DB] Raw saved user object:', JSON.stringify(leanUser, null, 2))
        console.log('[DB] Saved user profile exists:', !!leanUser.profile)
        console.log('[DB] Saved user profile onboardingCompleted:', leanUser.profile?.onboardingCompleted)

        const result = toUser(leanUser)
        console.log('[DB] Returning user with profile:', !!result?.profile)
        return result
      } catch (error) {
        console.error('[DB] Update error:', error)
        throw error
      }
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
