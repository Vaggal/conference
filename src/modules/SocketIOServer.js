const events = require("./Events");

exports.start = (webServer, config) => {
  const socketio = require("socket.io")(webServer, {
    log: false,
    cors: {
      origin: config.CORS_URL,
      methods: ["GET", "POST"],
    },
  });

  socketio.on("connection", (socket) => {
    socket.use((packet, next) => {
      if (socket.rooms.size > 1) {
        const currentRoomId = Array.from(socket.rooms).pop();
        events.setCurrentRoomId(currentRoomId);
      }
      // events.checkIfUserIsValid();
      next();
    });

    events.handle(socket);
    // TODO: here we should somehow export a function so that the webserver can determine if a roomId exists or not
  });
};
