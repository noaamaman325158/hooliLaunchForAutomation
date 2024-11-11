const { app, BrowserWindow } = require('electron');
const path = require('path');
const os = require('os');

// Use dynamic import for ESM module
const isDev = async () => (await import('electron-is-dev')).default;

// Create user-specific temp directory
const userTempDir = path.join(os.homedir(), '.electron-tmp');
require('fs').mkdirSync(userTempDir, { recursive: true });

// Set environment variables before app starts
process.env.DISABLE_DEV_SHM_USAGE = 'true';
process.env.TMPDIR = userTempDir;

// Configure Electron BEFORE window creation
app.disableHardwareAcceleration();

// Essential command line switches
app.commandLine.appendSwitch('disable-dev-shm-usage'); // Bypass /dev/shm
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-features', 'MediaSource,MediaCapabilities,WebRTC');
app.commandLine.appendSwitch('disable-component-update');

// Set the backend URL dynamically, allowing for an external backend
const backendURL = 'http://localhost:2222'; // Change this as needed

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false,
            disableBlinkFeatures: 'Autofill',
            webSecurity: true,
            sandbox: false,
            plugins: false,
            nativeWindowOpen: true,
        },
        show: false, // Don’t show until content is loaded
    });

    const indexPath = path.join(__dirname, 'build', 'index.html');
    console.log('Attempting to load from:', indexPath);

    win.loadURL(`file://${indexPath}`)
        .then(() => {
            console.log('Content loaded successfully');
            win.show();
        })
        .catch((error) => {
            console.error('Failed to load from file:', error);
            // Load from the backend URL if file loading fails
            win.loadURL(backendURL)
                .then(() => {
                    console.log('Content loaded from server successfully');
                    win.show();
                })
                .catch((serverError) => {
                    console.error('Failed to load from server:', serverError);
                    win.loadURL(`data:text/html,
            <html>
              <head>
                <title>Error</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  .error { color: red; }
                </style>
              </head>
              <body>
                <h1 class="error">Error Loading Application</h1>
                <p>File Error: ${error.message}</p>
                <p>Server Error: ${serverError.message}</p>
                <hr>
                <p>Please ensure the application is built properly and the server is running.</p>
              </body>
            </html>
          `);
                    win.show();
                });
        });

    return win;
}

let mainWindow = null;

async function initialize() {
    mainWindow = createWindow();
}

// App lifecycle
app.whenReady().then(initialize);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        initialize();
    }
});

// Handle crashes and errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    if (mainWindow) {
        mainWindow.loadURL(`data:text/html,
      <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .error { color: red; }
          </style>
        </head>
        <body>
          <h1 class="error">Application Error</h1>
          <p>${error.message}</p>
        </body>
      </html>
    `);
    }
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
});