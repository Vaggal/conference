const Room = require("../models/Room");
const Votes = require("../models/Votes");
const Conversation = require("../models/Conversation");

let rooms = {};
let talkDuration = 120;
let currentRoom;

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
      rooms[currentRoom].usersCount++;
      rooms[currentRoom].votes.peers[rooms[currentRoom].usersCount] = 0;
      fn(
        currentRoom,
        rooms[currentRoom].usersCount,
        rooms[currentRoom].conversation
      ); // It returns as an ack the room and user id to the client

      emitConnectionEvent(rooms[currentRoom]); // We emit the connection event to the rest of the sockets before adding the new one
      rooms[currentRoom].sockets.push(socket);
      emitVotesUpdateEvent(rooms[currentRoom]);

      console.log(
        "Peer connected to room",
        currentRoom,
        "with #",
        rooms[currentRoom].usersCount
      );
    } else {
      let roomObj = new Room(new Votes(), new Conversation());
      currentRoom = roomObj.id;
      rooms[currentRoom] = roomObj;
      rooms[currentRoom].votes.peers[0] = 0;

      rooms[currentRoom].sockets.push(socket);

      fn(
        currentRoom,
        rooms[currentRoom].usersCount,
        rooms[currentRoom].conversation
      ); // It returns as an ack the room,the user id and the conversation to the client

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
    rooms[currentRoom].votes.peers[user.id]++;
    emitVotesUpdateEvent(rooms[currentRoom]);
  });

  socket.on("conversation.type.selected", conversation => {
    rooms[currentRoom].votes.conversation[conversation.type]++;

    let looseVotes = rooms[currentRoom].votes.conversation.loose;
    let byTurnVotes = rooms[currentRoom].votes.conversation.byturn;
    let totalConversationVotes = looseVotes + byTurnVotes;

    if (
      totalConversationVotes === rooms[currentRoom].usersCount + 1 &&
      rooms[currentRoom].usersCount + 1 >= 2
    ) {
      if (looseVotes > byTurnVotes) {
        rooms[currentRoom].conversation.type = "loose";
      } else if (looseVotes < byTurnVotes) {
        rooms[currentRoom].conversation.type = "byturn";
      } else {
        rooms[currentRoom].conversation.type = "loose"; // TODO: We need to find a better solution for this
      }

      emitConversationType(rooms[currentRoom]);
      talkLoop(rooms[currentRoom], 30);
    }
  });

  socket.on("disconnect", () => {
    if (!currentRoom || !rooms[currentRoom]) {
      return;
    }
    console.log("Peer disconnected from room", currentRoom);

    if (rooms[currentRoom].sockets.length === 1) {
      delete rooms[currentRoom];
    } else {
      let socketIndex = rooms[currentRoom].sockets.indexOf(socket);
      rooms[currentRoom].sockets.splice(socketIndex, 1);

      rooms[currentRoom].sockets.forEach(socket => {
        if (socket) {
          socket.emit("peer.disconnected", {
            id: rooms[currentRoom].usersCount
          });
        }
      });
    }
  });

  function emitConnectionEvent(room) {
    room.sockets.forEach(socket => {
      socket.emit("peer.connected", {
        id: room.usersCount
      });
    });
  }

  function emitVotesUpdateEvent(room) {
    room.sockets.forEach(socket => {
      socket.emit("votes.update", room.votes.peers);
    });
  }

  function emitConversationType(room) {
    room.sockets.forEach(socket => {
      socket.emit("conversation.type.set", room.conversation);
    });
  }

  function emitTimeLeft(room, secondsLeft) {
    room.sockets.forEach(socket => {
      socket.emit("time.left", secondsLeft);
    });
  }

  function emitActivePeer(room, peerId) {
    room.sockets.forEach(socket => {
      socket.emit("active.peer", peerId);
    });
  }

  function findActivePeer() {
    let maxIds = [];
    let maxVotes = 0;

    Object.entries(rooms[currentRoom].votes.peers).forEach(entry => {
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
      rooms[currentRoom].votes.peers[peerId] = 0;
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
