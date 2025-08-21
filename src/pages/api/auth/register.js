import clientPromise from '@/lib/mongodb'
import { User } from '@/models/User'
import { signToken } from '@/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, email, password, fullName } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    const client = await clientPromise
    const db = client.db('social-media-platform')
    const users = db.collection('users')

    // Check if user already exists
    const existingUser = await users.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Email already exists' : 'Username already exists'
      })
    }

    // Hash password and create user
    const hashedPassword = await User.hashPassword(password)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullName: fullName || ''
    })

    // Insert user
    const result = await users.insertOne(newUser)
    const createdUser = await users.findOne({ _id: result.insertedId })

    // Create token
    const token = signToken({ 
      userId: createdUser._id, 
      email: createdUser.email 
    })

    // Return user without password
    const userResponse = new User(createdUser).toJSON()

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      token
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}