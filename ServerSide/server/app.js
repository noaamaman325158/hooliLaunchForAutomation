const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require('fs'); 
const cors = require("cors");
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const { checkMacAddressExists } = require('./mongoDBService.js');
const app = express();
const PORT = 3001;
const io = require('socket.io')(PORT);
require('log-timestamp');
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const LOCAL_MEMORY = {
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

let currentSocket = null; 

io.on('connection', (socket) => {
    console.log('Client connected');

    if (currentSocket) {
        console.log('Disconnecting previous client');
        currentSocket.disconnect(true);
    }

    socket.emit("SendAllData", LOCAL_MEMORY);

    currentSocket = socket; 

    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        currentSocket = null; 
    });

    socket.error('error', (err) => {
        console.log('Socket error:', err);
    });

    socket.on('UpdateSource', (value) => {
        LOCAL_MEMORY.source = value;
        console.log("UpdateSource", value);
    });


    var fsTimeout;
    console.log("------------------rock and roll baby");
    console.log("num of clients: ", Object.keys(io.sockets.connected).length, Object.keys(io.sockets.connected));
    fs.watch(SettingsPath, (event, filename) => {
        fs.readFile(SettingsPath, 'utf8', (err, data) => {
            if (!fsTimeout) {
                console.log("emit ", data);
                io.sockets.emit("NewTrade", data);
                fsTimeout = setTimeout(function () { fsTimeout = null }, 800000000);
            } else {
                console.log("not ok");
            }
        });
    });
});

fs.writeFile(SettingsPath, "", function (err) {
    if (err) throw err;
    console.log("It's saved!");
});