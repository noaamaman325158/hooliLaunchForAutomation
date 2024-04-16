const io = require('socket.io-client');
const fs = require('fs');

let serverIp = "192.168.1.116";
const serverUrl = `http://${serverIp}:3000`; 

console.log(`Connecting to server at: ${serverUrl}`);
const socket = io(serverUrl);

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('initialFileChanges', (fileChanges) => {
    console.log('Initial file changes received:', fileChanges);
});

socket.on('fileChange', (path) => {
    console.log('File change detected:', path);
    console.log(`THe path that we write to ${path}`)
    fs.appendFile('Globex_Source1_position.txt', `${path}\n`, (err) => {
        if (err) {
            console.error('Error appending to local file:', err);
            return;
        }
        console.log('Change appended to local file:', path);
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
