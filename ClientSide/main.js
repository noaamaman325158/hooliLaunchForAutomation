const { app, BrowserWindow } = require('electron');
const server = require('./server/app.js');

const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      disableBlinkFeatures: 'Autofill', 
    },
  });
  console.log(path.join(__dirname, 'client', 'build', 'index.html'))
  win.loadURL(`file://${path.join(__dirname, 'client', 'build', 'index.html')}`);
}
app.disableHardwareAcceleration();
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

pp.whenReady().then(() => {
  server.start(); // Start your Node.js backend server
  createWindow();
});