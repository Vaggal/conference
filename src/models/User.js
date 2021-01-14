class User {
  constructor(id, username, socket) {
    this.id = id;
    this.username = username;
    this.socket = socket;
    this.votes = 0;
    this.votingState = {
      forPeer: false,
      forConversation: false, // TODO: This will be used to check for user tryng to double vote
    };
  }
}

module.exports = User;
