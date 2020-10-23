const { v4: uuidv4 } = require("uuid");

class Room {
  constructor(votes, conversation, chat) {
    this.id = uuidv4();
    this.votes = votes;
    this.conversation = conversation;
    this.chat = chat;
    this.usersCount = 0;
    this.sockets = [];
  }
}
module.exports = Room;
