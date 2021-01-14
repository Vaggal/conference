const { v4: uuidv4 } = require("uuid");

class Room {
  constructor(conversation, chat) {
    this.id = uuidv4();
    this.conversation = conversation;
    this.chat = chat;
    this.usersIncrement = 0;
    this.users = [];
  }
}
module.exports = Room;
