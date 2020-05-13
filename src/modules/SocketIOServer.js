const events = require("./Events");
const socketio = require("socket.io");

exports.start = (socketServer) => {
  socketio
    .listen(socketServer, {
      log: false,
    })
    .on("connection", (socket) => {
      socket.use((packet, next) => {
        let roomsKeys = Object.keys(socket.rooms);
        if (roomsKeys.length > 1) {
          events.setCurrentRoomId(roomsKeys[roomsKeys.length - 1]);
        }
        next();
      });
      events.handle(socket);
    });
};
