class Comment {
  constructor(userId, message, username) {
    this.userId = userId;
    this.message = message;
    this.username = username;
    this.date = new Date();
  }
}
module.exports = Comment;
