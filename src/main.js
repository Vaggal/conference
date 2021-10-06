var config = require("./config/config.json");
var servers = require("./modules/Servers");

config.PORT = process.env.PORT || config.PORT;

servers.start(config);

process.on("SIGTERM", closeServers);
process.on("SIGTINT", closeServers);
process.on("SIGTSTP", closeServers);
process.on("SIGQUIT", closeServers);
process.on("exit", closeServers);

function closeServers(signal) {
  console.log(`Servers were shutdown. Received ${signal}.`);
  servers.close();
}
