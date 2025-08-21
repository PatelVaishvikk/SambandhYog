import { ObjectId } from 'mongodb'

export class Post {
  constructor(data) {
    this._id = data._id || new ObjectId()
    this.authorId = data.authorId
    this.content = data.content
    this.image = data.image || null
    this.likes = data.likes || []
    this.comments = data.comments || []
    this.shares = data.shares || 0
    this.isPublic = data.isPublic !== undefined ? data.isPublic : true
    this.tags = data.tags || []
    this.mentions = data.mentions || []
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  // Get like count
  getLikeCount() {
    return this.likes.length
  }

  // Get comment count
  getCommentCount() {
    return this.comments.length
  }

  // Check if user liked the post
  isLikedBy(userId) {
    return this.likes.some(like => like.toString() === userId.toString())
  }

  // Add like
  addLike(userId) {
    if (!this.isLikedBy(userId)) {
      this.likes.push(new ObjectId(userId))
      this.updatedAt = new Date()
    }
  }

  // Remove like
  removeLike(userId) {
    this.likes = this.likes.filter(like => like.toString() !== userId.toString())
    this.updatedAt = new Date()
  }
}