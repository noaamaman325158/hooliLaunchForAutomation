const { app, BrowserWindow } = require('electron');
const path = require('path');

// Disable hardware acceleration for reduced memory usage
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-dev-shm-usage');
app.commandLine.appendSwitch('no-sandbox');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
    },
    show: false,
  });

  const indexPath = path.join(__dirname, 'client', 'build', 'index.html');
  win.loadURL(`file://${indexPath}`)
      .then(() => win.show())
      .catch((error) => {
        console.error('Failed to load frontend:', error.message);
        showErrorPage(win, error);
      });

  return win;
}

function showErrorPage(win, error) {
  win.loadURL(`data:text/html,
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: red;">Error Loading Application</h1>
        <p>${error.message}</p>
        <p>Please ensure the application is built properly.</p>
      </body>
    </html>
  `);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
