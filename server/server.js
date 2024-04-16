
const express = require('express');
const cors = require("cors");
const socketIO = require('socket.io');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());


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

  socket.emit('initialFileChanges', fileChanges);

  socket.on('disconnect', () => {
      console.log('Client disconnected');
  });
});
