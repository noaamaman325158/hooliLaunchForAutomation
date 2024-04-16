
const express = require('express');
const cors = require("cors");
const socketIO = require('socket.io');
const socketIOClient = require('socket.io-client');

const chokidar = require('chokidar');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


const pathToWatch = "/home/noaa/Documents/NinjaTrader 8/outgoing/Globex_Source1_position.txt";
const remotePathToWrite = "C:\Users\OneDrive\Documents\NinjaTrader 8\outgoing\Globex_Source1_position.txt";
let fileChangesTracking = [];
let remoteComputerIp = "";
let remotePort = ""
const watcher = chokidar.watch(pathToWatch, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});



const io = socketIO(server, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.emit('initialFileChanges', fileChangesTracking);

  socket.on('disconnect', () => {

    fs.appendFile(remotePathToWrite, `${path}\n`, (err) => {
      if (err) {
        console.error('Error appending to file:', err);
        return;
      }
      console.log('Change appended to file:', path);
    });
    
  });
  

});

watcher.on('change', (path) => {
  fileChangesTracking.push(path);
  const remoteSocket = socketIOClient(`http://${remoteComputerIp}:${remotePort}`);

  remoteSocket.emit('The file is changed in the server side', path)

  io.emit('fileChange', path);
});