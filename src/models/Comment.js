class Comment {
  constructor(userId, comment) {
    this.userId = userId;
    this.comment = comment;
    this.date = new Date();
  }
}
module.exports = Comment;
