const uuid = require("uuid");

class Room {
  constructor(votes, conversation) {
    this.id = uuid.v4();
    this.votes = votes;
    this.conversation = conversation;
    this.usersCount = 0;
    this.sockets = [];
  }
}
module.exports = Room;
