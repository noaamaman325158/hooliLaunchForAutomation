const { connectToServer } = require('./services/socketHandler');
const os = require('os');
const path = require('path');
const { checkMacAddressExists } = require('./services/mongoDBService.js');
const { buyOrSell } = require('./services/tradingService.js');
const { getMacAddress, extractAccountName } = require('./utils/dataUtils'); 
const { appendToFile } = require('./utils/fileUtils'); 

const socket = connectToServer();

socket.on('connect', async () => {
  console.log('Connected to server');
    
  try {
    // Retrieve MAC address
    const macAddressToCheck = await getMacAddress();
    console.log(`THe mac address to check ${macAddressToCheck}`)
    const macAddressExists = await checkMacAddressExists(macAddressToCheck);
    console.log(`The mac address ${macAddressExists}`);
    
    // Ensure MAC address exists before proceeding
    if (!macAddressExists) {
      console.log('Current MAC address does not exist in the database. Stopping client server.');
      process.exit(1); 
    }
    
    // Proceed with other operations
    handleFileChanges();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
});

// Function to handle file changes
function handleFileChanges() {
  socket.on('initialFileChanges', (fileChanges) => {
    console.log('Initial file changes received:', fileChanges);
  });

  socket.on('fileChange', (data) => {
    console.log(`Change detected in file: ${data.path}`);
    console.log(`New content: ${data.content}`);
    console.log('File change detected, updating local file.');
    const outgoingFilePath = 'OneDrive/Documents/NinjaTrader 8/outgoing/';
    const localFilePath = path.join(os.homedir(), outgoingFilePath, `NQ 06-24 Globex${defaultAccountName}_position.txt`);
    
    appendToFile(data.content, extractAccountName(data.path)); // Using appendToFile function
    
    const extractedNameOfAccount = extractAccountName(data.path);
    if (extractedNameOfAccount) {
      console.log('Before buyOrSell function...');
      buyOrSell(extractedNameOfAccount, data.content);
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
}
