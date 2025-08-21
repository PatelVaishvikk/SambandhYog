import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

export class User {
  constructor(data) {
    this._id = data._id || new ObjectId()
    this.username = data.username
    this.email = data.email
    this.password = data.password
    this.fullName = data.fullName || ''
    this.bio = data.bio || ''
    this.avatar = data.avatar || '/default-avatar.png'
    this.followers = data.followers || []
    this.following = data.following || []
    this.isVerified = data.isVerified || false
    this.isAdmin = data.isAdmin || false
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  // Hash password before saving
  static async hashPassword(password) {
    return await bcrypt.hash(password, 12)
  }

  // Compare password
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
  }

  // Convert to JSON (remove password)
  toJSON() {
    const { password, ...userWithoutPassword } = this
    return userWithoutPassword
  }

  // Get user stats
  getStats() {
    return {
      followers: this.followers.length,
      following: this.following.length
    }
  }
}