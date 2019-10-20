const uuid = require("uuid");

// TODO: votes, users and conversations should handle multiple rooms

let rooms = {};
let userIds = {};
let votes = {
  peers: {},
  conversations: {}
};
let conversations = {};
let talkDuration = 120;
let currentRoom;
let id;

exports.handle = socket => {
  // The use of 'fn' callback is explained here: https://socket.io/docs/#Sending-and-getting-data-acknowledgements
  // These events are emitted by the client code that we have written
  socket.on("init", (data, fn) => {
    let existingRoom = data ? true : false;

    if (existingRoom) {
      currentRoom = data.room;
    } else {
      currentRoom = uuid.v4();
    }
    var room = rooms[currentRoom];

    if (!existingRoom) {
      rooms[currentRoom] = [socket];
      id = userIds[currentRoom] = 0;
      votes.peers[id] = 0;
      votes.conversations[currentRoom] = {
        byturn: 0,
        loose: 0
      };
      conversations[currentRoom] = {};

      fn(currentRoom, id); // It returns as an ack the room and user id to the client

      console.log("Room created, with #", currentRoom);
    } else {
      if (!room) {
        console.log("NOT ROOM!");
        return;
      }
      userIds[currentRoom] += 1;
      id = userIds[currentRoom];
      votes.peers[id] = 0;
      fn(currentRoom, id); // It returns as an ack the room and user id to the client

      emitConnectionEvent(room);
      room[id] = socket;
      emitVotesUpdateEvent(room);

      console.log("Peer connected to room", currentRoom, "with #", id);
    }
  });

  socket.on("msg", data => {
    var to = parseInt(data.to, 10);
    // TODO: how do we know the current room here?
    if (rooms[currentRoom] && rooms[currentRoom][to]) {
      console.log("Redirecting message to", to, "by", data.by);
      rooms[currentRoom][to].emit("msg", data);
    } else {
      console.warn("Invalid user");
    }
  });

  socket.on("votes.increment", user => {
    votes.peers[user.id]++;
    emitVotesUpdateEvent(rooms[currentRoom]);
  });

  socket.on("conversation.type.select", conversation => {
    // TODO: We need to improve the naming of these interactions
    votes.conversations[currentRoom][conversation.type]++;

    let looseVotes = votes.conversations[currentRoom].loose;
    let byTurnVotes = votes.conversations[currentRoom].byturn;

    let totalConversationVotes = looseVotes + byTurnVotes;
    if (
      totalConversationVotes === userIds[currentRoom] + 1 &&
      userIds[currentRoom] + 1 >= 3
    ) {
      if (looseVotes > byTurnVotes) {
        conversations[currentRoom].type = "loose";
      } else if (looseVotes < byTurnVotes) {
        conversations[currentRoom].type = "byturn";
      } else {
        conversations[currentRoom].type = "loose"; // TODO: We need to find a better solution for this
      }

      emitConversationType(rooms[currentRoom], conversations[currentRoom]);
      talkLoop(rooms[currentRoom], 30);
    }
  });

  socket.on("disconnect", () => {
    if (!currentRoom || !rooms[currentRoom]) {
      return;
    }
    console.log("Peer disconnected from room", currentRoom);

    delete rooms[currentRoom][rooms[currentRoom].indexOf(socket)];
    // TODO: If all peers have disconnected from a room, delete whole room
    rooms[currentRoom].forEach(socket => {
      if (socket) {
        socket.emit("peer.disconnected", {
          id: id
        });
      }
    });
  });

  function emitConnectionEvent(room) {
    room.forEach(socket => {
      socket.emit("peer.connected", {
        id: id
      });
    });
  }

  function emitVotesUpdateEvent(room) {
    room.forEach(socket => {
      socket.emit("votes.update", votes.peers);
    });
  }

  function emitConversationType(room, conversation) {
    room.forEach(socket => {
      socket.emit("conversation.type", conversation);
    });
  }

  function emitTimeLeft(room, secondsLeft) {
    room.forEach(socket => {
      socket.emit("time.left", secondsLeft);
    });
  }

  function emitActivePeer(room, peerId) {
    room.forEach(socket => {
      socket.emit("active.peer", peerId);
    });
  }

  function findActivePeer() {
    let maxIds = [];
    let maxVotes = 0;

    Object.entries(votes.peers).forEach(entry => {
      let peerVotes = entry[1];
      let peerId = entry[0];

      if (peerVotes > maxVotes) {
        // We reset the array as we have found a new higher value
        maxIds = [];
        maxIds.push(peerId);
      } else if (peerVotes == maxVotes) {
        // We add the peerId to the list as the peer has the same votes as the current maxVotes
        maxIds.push(peerId);
      }

      // We reset the peer's votes
      votes.peers[peerId] = 0;
    });

    // We select a random person from the array
    let randomMaxId = maxIds[Math.floor(Math.random() * maxIds.length)];

    return randomMaxId;
  }

  function talkLoop(room, secondsLeft) {
    emitTimeLeft(room, secondsLeft);

    setTimeout(() => {
      let activePeerId = findActivePeer();
      emitActivePeer(room, activePeerId);
      emitVotesUpdateEvent(room);
      talkLoop(room, talkDuration);
    }, secondsLeft * 1000);
  }
};
