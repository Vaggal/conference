const Room = require("../models/Room");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Chat = require("../models/Chat");
const Comment = require("../models/Comment");

let rooms = {};
let talkDuration = 120;
let currentRoomId;

exports.handle = (socket) => {
  // The use of 'fn' callback is explained here: https://socket.io/docs/#Sending-and-getting-data-acknowledgements
  // These events are emitted by the client code in conference-vue project
  socket.on("init", (data, fn) => {
    let existingRoom = data.room ? true : false;
    if (existingRoom) {
      socket.join(data.room);
      currentRoomId = data.room;
      if (!rooms[currentRoomId]) {
        console.log("Not a valid room!");
        return;
      }
      rooms[currentRoomId].usersIncrement++;
      let newUser = new User(
        rooms[currentRoomId].usersIncrement,
        data.username,
        socket
      );
      rooms[currentRoomId].users.push(newUser);

      fn(currentRoomId, newUser.id, rooms[currentRoomId].conversation); // It returns as an ack the room,the user id and the conversation to the client

      emitConnectionEvent(rooms[currentRoomId], newUser.id); // We emit the connection event to the rest of the sockets before adding the new one
      emitVotesUpdateEvent(rooms[currentRoomId]);
      // TODO: emit init event

      console.log(
        "Peer connected to room",
        currentRoomId,
        "with #",
        rooms[currentRoomId].usersIncrement
      );
    } else {
      let roomObj = new Room(new Conversation(), new Chat());
      currentRoomId = roomObj.id;
      socket.join(currentRoomId);
      rooms[currentRoomId] = roomObj;
      let newUser = new User(
        rooms[currentRoomId].usersIncrement,
        data.username,
        socket
      );
      rooms[currentRoomId].users.push(newUser);

      fn(currentRoomId, newUser.id, rooms[currentRoomId].conversation); // It returns as an ack the room,the user id and the conversation to the client

      console.log("Room created, with #", currentRoomId);
    }
  });

  socket.on("msg", (data) => {
    let to = parseInt(data.to, 10);
    let user = rooms[currentRoomId].users.find((user) => user.id === to);
    if (rooms[currentRoomId] && user.socket) {
      console.log("Redirecting message to", to, "by", data.by);
      user.socket.emit("msg", data);
    } else {
      console.warn("Invalid user");
    }
  });

  socket.on("new-comment", (data) => {
    let comment = new Comment(data.id, data.message, data.username);
    rooms[currentRoomId].chat.comments.push(comment);
    emitCommentEvent(rooms[currentRoomId], comment);
  });

  socket.on("votes.increment", (peer) => {
    rooms[currentRoomId].users.find((user) => user.id === peer.id).votes++;
    emitVotesUpdateEvent(rooms[currentRoomId]);
  });

  socket.on("conversation.type.selected", (data) => {
    let user = rooms[currentRoomId].users.find((user) => user.id === data.by);
    if (user.votingState.forConversation) {
      // We need to subtract from the other type as the user changed their selection
      if (data.conversation.type == "loose") {
        rooms[currentRoomId].conversation.votes.byturn--;
      } else {
        rooms[currentRoomId].conversation.votes.loose--;
      }
    } else {
      user.votingState.forConversation = true;
    }
    rooms[currentRoomId].conversation.votes[data.conversation.type]++;

    let looseVotes = rooms[currentRoomId].conversation.votes.loose;
    let byTurnVotes = rooms[currentRoomId].conversation.votes.byturn;
    let totalConversationVotes = looseVotes + byTurnVotes;

    if (
      totalConversationVotes === rooms[currentRoomId].users.length &&
      rooms[currentRoomId].users.length >= 2
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
    if (rooms[currentRoomId].users.length === 1) {
      delete rooms[currentRoomId];
    } else {
      let disconnectedUser = rooms[currentRoomId].users.find(
        (user) => user.socket === socket
      );
      let disconnectedUserIndex =
        rooms[currentRoomId].users.indexOf(disconnectedUser);
      rooms[currentRoomId].users.splice(disconnectedUserIndex, 1);

      rooms[currentRoomId].users.forEach((user) => {
        if (user.socket) {
          user.socket.emit("peer.disconnected", {
            id: disconnectedUser.id,
          });
        }
      });
    }
  });

  function emitConnectionEvent(room, connectedUserId) {
    room.users.forEach((user) => {
      if (user.id !== connectedUserId) {
        user.socket.emit("peer.connected", {
          id: connectedUserId,
        });
      }
    });
  }

  function emitVotesUpdateEvent(room) {
    let votesData = [];
    room.users.forEach((user) => {
      votesData.push({ id: user.id, votes: user.votes });
    });
    room.users.forEach((user) => {
      user.socket.emit("votes.update", votesData);
    });
  }

  function emitConversationType(room) {
    room.users.forEach((user) => {
      user.socket.emit("conversation.type.set", room.conversation);
    });
  }

  function emitCommentEvent(room, comment) {
    room.users.forEach((user) => {
      user.socket.emit("comment", comment);
    });
  }

  function emitTimeLeft(room, secondsLeft) {
    room.users.forEach((user) => {
      user.socket.emit("time.left", secondsLeft);
    });
  }

  function emitActivePeer(room, peerId) {
    room.users.forEach((user) => {
      user.socket.emit("active.peer", peerId);
    });
  }

  function findActivePeer() {
    let maxIds = [];
    let maxVotes = 0;

    rooms[currentRoomId].users.forEach((user) => {
      let peerVotes = user.votes;
      let peerId = user.id;

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
      user.votes = 0;
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

exports.setCurrentRoomId = (roomId) => {
  currentRoomId = roomId;
};
