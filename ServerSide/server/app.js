const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require('fs'); // Corrected: using fs.promises
const fsp = fs.promises;
const cors = require("cors");
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const {  checkMacAddressExists } = require('./mongoDBService.js');
const app = express();
const PORT = 2666;
const io = require('socket.io')(PORT);


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

LOCAL_MEMORY={
"source": "Sim101",
  "destinations": [
    "Sim102"
  ],
  "approveMAC": [
    "00:50:56:3f:ee:07",
    "4c:5f:70:9d:16:c9"
  ],
  "ComputerWindowsPAth": "C:\\Users\\"+os.userInfo().username+"\\Documents\\NinjaTrader 8\\outgoing\\",
}
const SettingsPath = `${LOCAL_MEMORY.ComputerWindowsPAth}NQ 06-24 Globex_${LOCAL_MEMORY.source}_position.txt`;

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit("SendAllData", LOCAL_MEMORY)

  socket.on('disconnect', () => {
      console.log('Client disconnected');
  });

socket.on('UpdateSource', (value) => {
  LOCAL_MEMORY.source= value;
  console.log("UpdateSource", value)
});



});

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
  const path =  "C:\\Users\\Administrator\\Documents\\NinjaTrader 8\\incoming\\oif." +  uuidv4() + ".txt";
  const mrkt = "PLACE;"+nameofAccount+";<INS>;<ACT>;<QTY>;MARKET;<LIMIT>;;DAY;;;;";
  var ordr = mrkt.replace("<INS>","NQ 06-24").replace("<ACT>",action).replace("<QTY>",amount);
  if( data.includes("FLAT")){
     ordr = "CLOSEPOSITION;<ACCOUNT>;<INSTRUMENT>;;;;;;;;;;".replace("<ACCOUNT>",nameofAccount).replace("<INSTRUMENT>","NQ 06-24");
  }
  fs.writeFileSync(path,ordr);
  //console.log("finally ", path,ordr)
});

};
fs.writeFile(SettingsPath, "", function (err) {
  if (err) throw err;
  console.log("It's saved!");
});

fs.watch(SettingsPath,(event,filename)=>{
  socket.emit("NewTrade", LOCAL_MEMORY)
  // count++;
  //   if(count%2==0){
  //       for(var key in LOCAL_MEMORY.destinations ){
  //         console.log("Copy same trade to -",LOCAL_MEMORY.destinations[key] )
          
  //       }
  //   };
    
});

