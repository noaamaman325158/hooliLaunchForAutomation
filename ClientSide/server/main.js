const { app, BrowserWindow } = require('electron');
const path = require('path');
const server = require('./app.js'); // Import your server module

// Start the server when Electron app is ready
app.whenReady().then(() => {
    server.start(); // Start your backend server

    // Optional: Create a hidden window if Electron requires one to run
    const win = new BrowserWindow({
        show: false, // Keep the window hidden
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // Load a blank page or a local file to satisfy Electron's requirement
    win.loadURL('data:text/html, <html></html>');

    win.on('close', (e) => {
        e.preventDefault();
        app.quit();
    });
});

// Cleanly shut down on all windows closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
