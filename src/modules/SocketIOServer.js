const events = require("./Events");
const socketio = require("socket.io");

exports.start = socketServer => {
  socketio
    .listen(socketServer, {
      log: false
    })
    .on("connection", socket => {
      events.handle(socket);
    });
};
