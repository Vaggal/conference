const Room = require("../models/Room");
const Votes = require("../models/Votes");
const Conversation = require("../models/Conversation");

let rooms = {};
let talkDuration = 120;
let currentRoomId;

exports.handle = socket => {
  // The use of 'fn' callback is explained here: https://socket.io/docs/#Sending-and-getting-data-acknowledgements
  // These events are emitted by the client code in conference-vue project
  socket.on("init", (data, fn) => {
    let existingRoom = data ? true : false;

    if (existingRoom) {
      socket.join(data.room);
      currentRoomId = data.room;
      if (!rooms[currentRoomId]) {
        console.log("NOT ROOM!");
        return;
      }
      rooms[currentRoomId].usersCount++;
      rooms[currentRoomId].votes.peers[rooms[currentRoomId].usersCount] = 0;
      fn(
        currentRoomId,
        rooms[currentRoomId].usersCount,
        rooms[currentRoomId].conversation
      ); // It returns as an ack the room and user id to the client

      emitConnectionEvent(rooms[currentRoomId]); // We emit the connection event to the rest of the sockets before adding the new one
      rooms[currentRoomId].sockets.push(socket);
      emitVotesUpdateEvent(rooms[currentRoomId]);

      console.log(
        "Peer connected to room",
        currentRoomId,
        "with #",
        rooms[currentRoomId].usersCount
      );
    } else {
      let roomObj = new Room(new Votes(), new Conversation());
      currentRoomId = roomObj.id;
      socket.join(currentRoomId);
      rooms[currentRoomId] = roomObj;
      rooms[currentRoomId].votes.peers[0] = 0;

      rooms[currentRoomId].sockets.push(socket);

      fn(
        currentRoomId,
        rooms[currentRoomId].usersCount,
        rooms[currentRoomId].conversation
      ); // It returns as an ack the room,the user id and the conversation to the client

      console.log("Room created, with #", currentRoomId);
    }
  });

  socket.on("msg", data => {
    var to = parseInt(data.to, 10);
    if (rooms[currentRoomId] && rooms[currentRoomId].sockets[to]) {
      console.log("Redirecting message to", to, "by", data.by);
      rooms[currentRoomId].sockets[to].emit("msg", data);
    } else {
      console.warn("Invalid user");
    }
  });

  socket.on("votes.increment", user => {
    rooms[currentRoomId].votes.peers[user.id]++;
    emitVotesUpdateEvent(rooms[currentRoomId]);
  });

  socket.on("conversation.type.selected", conversation => {
    rooms[currentRoomId].votes.conversation[conversation.type]++;

    let looseVotes = rooms[currentRoomId].votes.conversation.loose;
    let byTurnVotes = rooms[currentRoomId].votes.conversation.byturn;
    let totalConversationVotes = looseVotes + byTurnVotes;

    if (
      totalConversationVotes === rooms[currentRoomId].usersCount + 1 &&
      rooms[currentRoomId].usersCount + 1 >= 2
    ) {
      let type = "";
      if (looseVotes > byTurnVotes) {
        type = "loose";
      } else if (looseVotes < byTurnVotes) {
        type = "byturn";
      } else {
        // TODO: We need to find a better solution for the case where we have equal votes
        type = "loose";
      }
      rooms[currentRoomId].conversation.type = type;
      emitConversationType(rooms[currentRoomId]);

      if (type === "byturn") {
        talkLoop(rooms[currentRoomId], 30);
      }
    }
  });

  socket.on("disconnect", () => {
    if (!currentRoomId || !rooms[currentRoomId]) {
      return;
    }
    console.log("Peer disconnected from room", currentRoomId);

    socket.leaveAll();
    if (rooms[currentRoomId].sockets.length === 1) {
      delete rooms[currentRoomId];
    } else {
      let socketIndex = rooms[currentRoomId].sockets.indexOf(socket);
      rooms[currentRoomId].sockets.splice(socketIndex, 1);

      rooms[currentRoomId].sockets.forEach(socket => {
        if (socket) {
          socket.emit("peer.disconnected", {
            id: rooms[currentRoomId].usersCount
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

    Object.entries(rooms[currentRoomId].votes.peers).forEach(entry => {
      let peerVotes = entry[1];
      let peerId = entry[0];

      if (peerVotes > maxVotes) {
        // We reset the array as we have found a new higher value
        maxIds = [];
        maxIds.push(peerId);
        maxVotes = peerVotes;
      } else if (peerVotes == maxVotes) {
        // We add the peerId to the list as the peer has the same votes as the current maxVotes
        maxIds.push(peerId);
      }

      // We reset the peer's votes
      rooms[currentRoomId].votes.peers[peerId] = 0;
    });

    // We select a random person from the array
    let randomMaxId = maxIds[Math.floor(Math.random() * maxIds.length)];

    return randomMaxId;
  }

  function talkLoop(room, secondsLeft) {
    emitTimeLeft(room, secondsLeft);

    setTimeout(() => {
      if (rooms[currentRoomId] !== undefined) {
        let activePeerId = findActivePeer();
        emitActivePeer(room, activePeerId);
        emitVotesUpdateEvent(room);
        talkLoop(room, talkDuration);
      }
    }, secondsLeft * 1000);
  }
};

exports.setCurrentRoomId = roomId => {
  currentRoomId = roomId;
};
