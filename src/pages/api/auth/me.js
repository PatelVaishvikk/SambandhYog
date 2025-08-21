import clientPromise from '@/lib/mongodb'
import { User } from '@/models/User'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = getTokenFromHeader(req)
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = verifyToken(token)
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const client = await clientPromise
    const db = client.db('social-media-platform')
    const users = db.collection('users')

    // Find user by ID
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Return user without password
    const userResponse = new User(user).toJSON()

    res.status(200).json({
      user: userResponse
    })

  } catch (error) {
    console.error('Auth check error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}