import clientPromise from '@/lib/mongodb'
import { User } from '@/models/User'
import { signToken } from '@/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const client = await clientPromise
    const db = client.db('social-media-platform')
    const users = db.collection('users')

    // Find user by email
    const user = await users.findOne({ email })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await User.comparePassword(password, user.password)
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Create token
    const token = signToken({ 
      userId: user._id, 
      email: user.email 
    })

    // Return user without password
    const userResponse = new User(user).toJSON()

    res.status(200).json({
      message: 'Login successful',
      user: userResponse,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}