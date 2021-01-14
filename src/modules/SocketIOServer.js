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
        // events.checkIfUserIsValid();
        next();
      });
      events.handle(socket);
      // TODO: here we should somehow export a function so that the webserver can determine if a roomIdd exists or not
    });
};
