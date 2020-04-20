const Room = require("../models/Room");
const Votes = require("../models/Votes");
const Conversation = require("../models/Conversation");

// TODO: votes, users and conversations should handle multiple rooms
// TODO: all these can be different classes that can be nested and all sent at every update
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
  // These events are emitted by the client code in conference-vue project
  socket.on("init", (data, fn) => {
    let existingRoom = data ? true : false;

    if (existingRoom) {
      currentRoom = data.room;
      console.log("Data: ", data);
      if (!rooms[currentRoom]) {
        console.log("NOT ROOM!");
        return;
      }
      rooms[currentRoom].usersCount += 1;
      rooms[currentRoom].votes.peers[rooms[currentRoom].usersCount] = 0;
      userIds[currentRoom] += 1; // TODO: Delete
      id = userIds[currentRoom]; // TODO: Delete
      votes.peers[id] = 0; // TODO: Delete
      fn(currentRoom, id, conversations[currentRoom]); // It returns as an ack the room and user id to the client

      emitConnectionEvent(rooms[currentRoom].sockets); // We emit the connection event to the rest of the sockets before adding the new one
      rooms[currentRoom].sockets.push(socket);
      emitVotesUpdateEvent(rooms[currentRoom].sockets);

      console.log("Peer connected to room", currentRoom, "with #", id);
    } else {
      let roomObj = new Room(new Votes(), new Conversation());
      currentRoom = roomObj.id;
      rooms[currentRoom] = roomObj;
      rooms[currentRoom].votes.peers[0] = 0;

      rooms[currentRoom].sockets.push(socket);
      console.log("Votes Old: ", votes);
      id = userIds[currentRoom] = 0; // TODO: Delete
      votes.peers[id] = 0; // TODO: Delete
      votes.conversations[currentRoom] = {
        byturn: 0,
        loose: 0
      }; // TODO: Delete
      conversations[currentRoom] = {}; // TODO: Delete

      fn(currentRoom, id, conversations[currentRoom]); // It returns as an ack the room and user id to the client

      console.log("Room created, with #", currentRoom);
    }
  });

  socket.on("msg", data => {
    var to = parseInt(data.to, 10);
    // TODO: how do we know the current room here?
    if (rooms[currentRoom] && rooms[currentRoom].sockets[to]) {
      console.log("Redirecting message to", to, "by", data.by);
      rooms[currentRoom].sockets[to].emit("msg", data);
    } else {
      console.warn("Invalid user");
    }
  });

  socket.on("votes.increment", user => {
    console.group("votes.increment");
    console.log("Rooms: ", rooms);
    console.log("Votes: ", votes);
    console.log("Conversations: ", conversations);
    console.log("UserIds: ", userIds);
    console.groupEnd("votes.increment");
    votes.peers[user.id]++;
    emitVotesUpdateEvent(rooms[currentRoom].sockets);
  });

  socket.on("conversation.type.selected", conversation => {
    // TODO: We need to improve the naming of these interactions
    votes.conversations[currentRoom][conversation.type]++;

    let looseVotes = votes.conversations[currentRoom].loose;
    let byTurnVotes = votes.conversations[currentRoom].byturn;

    let totalConversationVotes = looseVotes + byTurnVotes;
    if (
      totalConversationVotes === userIds[currentRoom] + 1 &&
      userIds[currentRoom] + 1 >= 2
    ) {
      if (looseVotes > byTurnVotes) {
        conversations[currentRoom].type = "loose";
      } else if (looseVotes < byTurnVotes) {
        conversations[currentRoom].type = "byturn";
      } else {
        conversations[currentRoom].type = "loose"; // TODO: We need to find a better solution for this
      }

      emitConversationType(
        rooms[currentRoom].sockets,
        conversations[currentRoom]
      );
      talkLoop(rooms[currentRoom].sockets, 30);
    }
  });

  socket.on("disconnect", () => {
    if (!currentRoom || !rooms[currentRoom]) {
      return;
    }
    console.log("Peer disconnected from room", currentRoom);

    rooms[currentRoom].splice(rooms[currentRoom].sockets.indexOf(socket), 1);

    // TODO: If all peers have disconnected from a room, delete whole room
    if (rooms[currentRoom].length === 0) {
      delete rooms[currentRoom];
      delete userIds[currentRoom];
      votes.peers = {};
      delete votes.conversations[currentRoom];
      delete conversations[currentRoom];
    } else {
      rooms[currentRoom].sockets.forEach(socket => {
        if (socket) {
          socket.emit("peer.disconnected", {
            id: id
          });
        }
      });
    }
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
      socket.emit("conversation.type.set", conversation);
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

  function talkLoop(roomSockets, secondsLeft) {
    emitTimeLeft(roomSockets, secondsLeft);

    setTimeout(() => {
      let activePeerId = findActivePeer();
      emitActivePeer(roomSockets, activePeerId);
      emitVotesUpdateEvent(roomSockets);
      talkLoop(roomSockets, talkDuration);
    }, secondsLeft * 1000);
  }
};
