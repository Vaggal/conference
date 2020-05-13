const uuid = require("uuid");

class Room {
  constructor(votes, conversation, chat) {
    this.id = uuid.v4();
    this.votes = votes;
    this.conversation = conversation;
    this.chat = chat;
    this.usersCount = 0;
    this.sockets = [];
  }
}
module.exports = Room;
