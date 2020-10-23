var config = require("./config/config.json");
var servers = require("./modules/Servers");

config.PORT = process.env.PORT || config.PORT;

servers.start(config);
