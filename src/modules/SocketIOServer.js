const events = require("./Events");
const socketio = require("socket.io");

exports.start = function(socketServer) {
  socketio
    .listen(socketServer, {
      log: false
    })
    .on("connection", function(socket) {
      events.handle(socket);
    });
};
