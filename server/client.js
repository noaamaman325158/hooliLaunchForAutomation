const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');

let serverIp = "192.168.1.116"; // IP of the local server
const serverUrl = `http://${serverIp}:3000`;

const localFilePath = path.join(__dirname, 'Globex_Source1_position.txt'); // Ensures file is in the current directory

console.log(`Connecting to server at: ${serverUrl}`);
const socket = io(serverUrl);

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('initialFileChanges', (fileChanges) => {
    console.log('Initial file changes received:', fileChanges);
});

socket.on('fileChange', (data) => {
    console.log('File change detected, updating local file.');
    fs.appendFile(localFilePath, `${data}\n`, (err) => {
        if (err) {
            console.error('Error appending to local file:', err);
            return;
        }
        console.log('Change appended to local file.');
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
