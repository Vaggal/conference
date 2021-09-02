const express = require("express");
const expressWebApp = express();
const http = require("http");
const webServer = http.createServer(expressWebApp);
const socketIOServer = require("./SocketIOServer");
const path = require("path");
const enforce = require("express-sslify");

expressWebApp.use(enforce.HTTPS({ trustProtoHeader: true }));
expressWebApp.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
expressWebApp.use(express.static(__dirname + "/../../public"));

expressWebApp.get("/room", (request, response) => {
  response.sendFile(path.resolve(__dirname, "../../public/index.html"));
});

expressWebApp.get("/room/:roomId", (request, response) => {
  response.sendFile(path.resolve(__dirname, "../../public/index.html"));
});

exports.start = (config) => {
  webServer.listen(config.PORT, () => {
    console.log("Servers Listening on", config.PORT);
  });

  socketIOServer.start(webServer, config);
};
