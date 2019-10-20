const express = require("express");
const expressSocketApp = express();
const http = require("http");
const socketServer = http.createServer(expressSocketApp);
const socketIOServer = require("./SocketIOServer");

expressSocketApp.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

exports.start = function(config) {
  socketServer.listen(config.PORT, () => {
    console.log("Socket Server Listening on", config.PORT);
  });

  socketIOServer.start(socketServer);
};
