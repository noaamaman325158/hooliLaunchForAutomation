const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');
const { checkMacAddressExists } = require('./mongoDBService.js');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cors = require('cors');


const app = express();

const port = 2649;
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`client running on http://localhost:${port}`);
});

// const backendPort = 3003;
// const serverIp = "185.241.5.114"; 
// //const serverIp = "192.168.1.116";


function getMacAddress() {
  const networkInterfaces = os.networkInterfaces();
  let macAddress = null;

  // Loop through all network interfaces
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const networkInterface = networkInterfaces[interfaceName];
    
    // Loop through all addresses of the current interface
    networkInterface.forEach((address) => {
      // Check if the address is a MAC address and not internal or loopback
      if (!address.internal && address.mac && address.mac !== '00:00:00:00:00:00') {
        macAddress = address.mac;
      }
    });
  });

  return macAddress;
}

const serverIp = "185.241.5.114"; 
//const serverIp = "127.0.0.1";
const portServer = "2648";
const serverUrl = `http://${serverIp}:${portServer}`;
const homedir = os.homedir();

//const localFilePath = "C:/Users/noaam/OneDrive/Documents/NinjaTrader 8/outgoing/Globex_Source1_position.txt";
const localFilePath = path.join(homedir, 'Documents', `NinjaTrader 8/outgoing/NQ 06-24 Globex_Sim101_position.txt`);
console.log(`Connecting to server at: ${serverUrl}`);
const socket = io(serverUrl);

socket.on('connect', async () => {
    console.log('Connected to server');
    
    const macAddressToCheck = getMacAddress();
    if (!macAddressToCheck) {
        console.log('Failed to retrieve MAC address. Stopping client server.');
        process.exit(1);
    }
    
    const macAddressExists = await checkMacAddressExists(macAddressToCheck);
    
    if (!macAddressExists) {
        console.log('Current MAC address does not exist in the database. Stopping client server.');
        process.exit(1); 
    }  app.get('/getClientDestinationsAllowTracking', async (req, res) => {
      try {
        const settings = await getDestinationsFromSettings();
        const destinationsTrackingAllowed = settings.client_destinations;
        res.json(destinationsTrackingAllowed); 
      } catch (error) {
        console.error('Failed to retrieve settings:', error);
        res.status(500).json({ error: "Failed to retrieve destinations tracking data" });
      }
    });
});

socket.on('initialFileChanges', (fileChanges) => {
    console.log('Initial file changes received:', fileChanges);
});
function extractAccountName(filePath) {
  const pattern = /Globex_(.+?)_position\.txt$/;
  const match = filePath.match(pattern);

  if (match && match[1]) {
      return match[1];
  } else {
      return null; 
  }
}
socket.on('fileChange', (data) => {
    console.log(`Change detected in file: ${data.path}`);
    console.log(`New content: ${data.content}`);
    console.log('File change detected, updating local file.');
    fs.appendFile(localFilePath, `${data.content}\n`, (err) => {
        if (err) {
            console.error('Error appending to local file:', err);
            return;
        }
        console.log('Change appended to local file.');
    });

    // Here I need to extract the name of the the account from the path
    const extractedNameOfAccount = extractAccountName(data.path);
    count++;
      if(count%2==0){
          //console.log("File Changed", event, filename);
          fs.readFile(data.path, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }

          });
          // for(var key in settings.destinations ){
          //   buyofsell(settings.destinations[key]);
          // }
          if(extractAccountName){
            console.log('Beofre buyofsell function...')
            buyofsell(extractedNameOfAccount);
          }
      };
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Integrate the buyofsell function

//Extract Settings Content
const filePath = path.join(__dirname, 'settings.json');
const settings = JSON.parse(fs.readFileSync(filePath));
const nameOfAccount = "Sim101";

function getUserDocumentsPath() {
  let homeDir = os.homedir();
  let documentsPath;

  switch (os.platform()) {
      case 'win32': // Windows
          documentsPath = path.join(homeDir, 'Documents');
          break;
      case 'darwin': // macOS
          documentsPath = path.join(homeDir, 'Documents');
          break;
      case 'linux': // Linux
          
          documentsPath = path.join(homeDir, 'Documents');
          break;
      default:
          throw new Error('Unsupported platform');
  }

  return documentsPath;
}

const SettingsPath = path.join(getUserDocumentsPath(), "NinjaTrader 8", "outgoing", `NQ 06-24 Globex_${nameOfAccount}_position.txt`);
console.log(`The settings path is ${SettingsPath}`)
let count = 0;

const returnAction = (data) => {  
  return data.includes('LONG') ? 'BUY': 'SELL';
};

const returnAmount = (data) => {
  return data.split(';')[1];
};

const returnCurrentValues = (data) => {
  valuedictionary = {
    'action': returnAction(data),
    'Amount': returnAmount(data)
  };
  return valuedictionary;
};


let Currentvalues = {};

let PrevFunction = {
    'action': null,
    'Amount': 0
  };
      
var buyofsell = (nameofAccount)=>{
    fs.readFile(SettingsPath.replace(settings.source, nameofAccount), 'utf8', (err, OldFileData) => {
        if (err) {
          console.error(err);
          return;
        }
        
        PrevFunction["action"] = OldFileData.includes('LONG') ? 'BUY': 'SELL';
        PrevFunction["Amount"] = OldFileData.split(';')[1];
       // console.log("new sim data ",OldFileData, PrevFunction)
    });
    fs.readFile(SettingsPath, 'utf8', (err, data) => {
   
    Currentvalues= returnCurrentValues(data);
    //console.log("data ",data, Currentvalues, PrevFunction)
    if (!PrevFunction["Amount"]){
        PrevFunction["Amount"]=0;
    }
    var action= Currentvalues["action"];
    var amount= Currentvalues["Amount"]-  PrevFunction["Amount"];

    if (Currentvalues["Amount"]-  PrevFunction["Amount"] < 0){
      console.log("inside if statement ", Currentvalues["Amount"]-  PrevFunction["Amount"]);
      action = action.includes("SELL") ? "BUY" : "SELL";
      //action=data.includes("LONG") ? "BUY": "SELL";
      amount = -amount ;
    }
    console.log("account name- ",nameofAccount, "action -", action, " amount- ",amount, "prev was -", PrevFunction, " current- ", Currentvalues)
    const _path =  path.join(getUserDocumentsPath(), `NinjaTrader 8\\incoming\\oif.${uuidv4()}.txt`);
    const mrkt = "PLACE;"+nameofAccount+";<INS>;<ACT>;<QTY>;MARKET;<LIMIT>;;DAY;;;;";
    var ordr = mrkt.replace("<INS>","NQ 06-24").replace("<ACT>",action).replace("<QTY>",amount);
    if( data.includes("FLAT")){
       ordr = "CLOSEPOSITION;<ACCOUNT>;<INSTRUMENT>;;;;;;;;;;".replace("<ACCOUNT>",nameofAccount).replace("<INSTRUMENT>","NQ 06-24");
    }
    fs.writeFileSync(_path,ordr);
    //console.log("finally ", path,ordr)
  });
  
  };
  

  

  app.post('/addSource', (req, res) => {
    console.log('Inside the addSource endpoint in the client code')
    const { sourceName } = req.body;
    if (!sourceName) {
        return res.status(400).send('Source name is required');
    }
  
    fs.readFile('./settings.json', (err, data) => {
        if (err) {
            return res.status(500).send('Failed to read settings');
        }
  
        const settings = JSON.parse(data);
        if (!settings.client_destinations) {
            settings.client_destinations = [];
        }
        if (settings.client_destinations.includes(sourceName)) {
            return res.status(409).send('Source already exists');
        }
  
        settings.client_destinations.push(sourceName);
  
        fs.writeFile('./settings.json', JSON.stringify(settings, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Failed to update settings');
            }
            res.send('Source added successfully');
        });
    });
  });

  
app.delete('/deleteSource', (req, res) => {
  console.log('Inside the deleteSource endpoint in the server');
  const sourceName = req.query.sourceName; 
  if (!sourceName) {
    return res.status(400).send('Source name is required');
  }

  fs.readFile('./settings.json', (err, data) => {
    if (err) {
      return res.status(500).send('Failed to read settings');
    }

    const settings = JSON.parse(data);
    const index = settings.client_destinations.indexOf(sourceName);
    if (index === -1) {
      return res.status(404).send('Source not found');
    }

    settings.client_destinations.splice(index, 1);

    fs.writeFile('./settings.json', JSON.stringify(settings, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Failed to update settings');
      }
      res.send('Source deleted successfully');
    });
  });
});

app.get('/getClientDestinationsTracking', async (req, res) => {
  try {
    const settings = await getDestinationsFromSettings();
    const destinationsTracking = settings.client_destinations;
    res.json(destinationsTracking); 
  } catch (error) {
    console.error('Failed to retrieve settings:', error);
    res.status(500).json({ error: "Failed to retrieve destinations tracking data" });
  }
});