class Comment {
  constructor(userId, message) {
    this.userId = userId;
    this.message = message;
    this.date = new Date();
  }
}
module.exports = Comment;
