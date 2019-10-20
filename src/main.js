var config = require("./config/config.json");
var webServer = require("./modules/WebServer");
var socketServer = require("./modules/SocketServer");

config.PORT = process.env.PORT || config.PORT;

socketServer.start(config);
webServer.start();
