const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require('fs'); // Corrected: using fs.promises
const cors = require("cors");
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const { checkMacAddressExists } = require('./mongoDBService.js');
const app = express();
const PORT = 2666;
const io = require('socket.io')(PORT);
require('log-timestamp');
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware to block localhost connections
io.use((socket, next) => {
    const clientIp = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    if (clientIp === '127.0.0.1' || clientIp === '::ffff:127.0.0.1') {
        console.log('Connection from localhost is denied.');
        return next(new Error('Connection from localhost is not allowed.'));
    }
    next();
});

// Initialize a map to keep track of connected clients
const connectedClients = new Map();

LOCAL_MEMORY = {
    "couter": 0,
    "source": "Sim101",
    "destinations": [
        "Sim102"
    ],
    "approveMAC": [
        "00:50:56:3f:ee:07",
        "4c:5f:70:9d:16:c9"
    ],
    "ComputerWindowsPAth": "C:\\Users\\" + os.userInfo().username + "\\Documents\\NinjaTrader 8\\outgoing\\",
}
const SettingsPath = `${LOCAL_MEMORY.ComputerWindowsPAth}NQ 06-24 Globex_${LOCAL_MEMORY.source}_position.txt`;

io.on('connection', (socket) => {
    console.log('Client connected');
    // Assign a unique identifier to each client
    const clientId = uuidv4();
    connectedClients.set(clientId, {
        socketId: socket.id,
        ip: socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress,
        userAgent: socket.request.headers['user-agent']
    });
    console.log(`Client ${clientId} connected with socket ID: ${socket.id}, IP: ${socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress}, User-Agent: ${socket.request.headers['user-agent']}`);

    socket.emit("SendAllData", LOCAL_MEMORY)

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        // Remove the client from the connectedClients map when disconnected
        connectedClients.delete(clientId);
        console.log(`Client ${clientId} disconnected`);
    });

    socket.error('error', (err) => {
        console.log('Socket error:', err);
    });

    socket.on('UpdateSource', (value) => {
        LOCAL_MEMORY.source = value;
        console.log("UpdateSource", value)
    });

    // Log the actual number of connected clients
    console.log("Number of connected clients:", io.engine.clientsCount);

    var fsTimeout
    console.log("------------------rock and roll baby")
    console.log("num of clients: ", Object.keys(io.sockets.connected).length, Object.keys(io.sockets.connected))
    fs.watch(SettingsPath, (event, filename) => {
        fs.readFile(SettingsPath, 'utf8', (err, data) => {
            if (!fsTimeout) {
                console.log("emit ", data)
                io.sockets.emit("NewTrade", data)
                fsTimeout = setTimeout(function () { fsTimeout = null }, 800000000) // give 5 seconds for multiple events
            } else {
                console.log("not ok")
            }
        })
    });
});

fs.writeFile(SettingsPath, "", function (err) {
    if (err) throw err;
    console.log("It's saved!");
});
