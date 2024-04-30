const io = require('socket.io-client');
const { serverIp, serverPort } = require('../config/config');

function connectToServer() {
  const serverUrl = `http://${serverIp}:${serverPort}`;
  console.log(`Connecting to server at: ${serverUrl}`);
  return io(serverUrl);
}

module.exports = { connectToServer };
