const express = require('express');
const cors = require("cors");
const fs = require('fs');
const socketIO = require('socket.io');
const socketIOClient = require('socket.io-client');
const chokidar = require('chokidar');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const pathToWatch = "/home/noaa/Documents/NinjaTrader 8/outgoing/Globex_Source1_position.txt";
const remotePathToWrite = "C:\\Users\\OneDrive\\Documents\\NinjaTrader 8\\outgoing\\Globex_Source1_position.txt";
let fileChangesTracking = [];
let remoteComputerIp = "192.168.1.117"; // Example IP, should be the IP of the remote server
let remotePort = "3001"; // Example port

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

  watcher.on('change', (path) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }
      // Emit the content changes, not just the path
      io.emit('fileChange', data);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
