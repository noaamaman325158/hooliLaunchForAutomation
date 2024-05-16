const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require('fs'); // Corrected: using fs.promises
const fsp = fs.promises;
const cors = require("cors");
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const {  checkMacAddressExists } = require('./mongoDBService.js');
const app = express();
const PORT = 2222;
const io = require('socket.io')(PORT);


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

LOCAL_MEMORY={
  "destinations": [
    "Sim102",
  ],
  "server_ip": "185.241.5.114",
  "allowed_clients": [],
  
  "clients_connected": [],
  "client_destinations": [
  ],
  "ComputerWindowsPAth": "C:\\Users\\"+os.userInfo().username+"\\Documents\\NinjaTrader 8\\outgoing\\",  
}




const SettingsPath = `${LOCAL_MEMORY.ComputerWindowsPAth}NQ 06-24 Globex_${LOCAL_MEMORY.source}_position.txt`;

io.on('connection', (socket) => {
  console.log('Client connected -CLIENT SERVER SIDE',LOCAL_MEMORY.destinations );
  socket.emit("SendAllData", LOCAL_MEMORY)

  socket.on('disconnect', () => {
      console.log('Client disconnected');
  });

socket.on('DeleteDestination', (value) => {
  console.log('Server DeleteDestination', value);
  LOCAL_MEMORY.destinations = LOCAL_MEMORY.destinations.filter(item => item !== value);
  console.log("new Local memory", LOCAL_MEMORY)
});
socket.on('AddDestination', (value) => {
  
  LOCAL_MEMORY.destinations.push(value);
  console.log('Server UpdateDestination', LOCAL_MEMORY.destinations);
});

socket.on('TradeNow', (data) => {
  console.log('TradeNow', data);
  let d =FuctionForTrade(data)
  console.log(d)
  for(var key in LOCAL_MEMORY.destinations ){
    console.log("Copy same trade to -",LOCAL_MEMORY.destinations[key] )
    //buyofsell(LOCAL_MEMORY.destinations[key]);
  }
});

});

let Currentvalues = {};
let PrevFunction = {
      'action': "FLAT",
      'Amount': 0
};

const FuctionForTrade=(order)=>{
  
  Currentvalues['action'] =returnAction(order)
  Currentvalues["Amount"] = returnAmount(order)
  //console.log("--> ",PrevFunction, Currentvalues)
  const { action: currentAction, amount: currentAmount } = Currentvalues;
  const { action: prevAction, amount: prevAmount } = PrevFunction;

  var action= Currentvalues["action"];
  var amount= Currentvalues["Amount"]-  PrevFunction["Amount"];

  if (Currentvalues["Amount"]-  PrevFunction["Amount"] < 0){
    
    action = action.includes("BUY") ? "SELL" : "BUY";
    amount = -amount ;
  }

  var nameofAccount = "Sim101"
  console.log("account name- ",nameofAccount, "action -", action, " amount- ",amount, "prev was -", PrevFunction, " current- ", Currentvalues)
  const path =  "C:\\Users\\Administrator\\Documents\\NinjaTrader 8\\incoming\\oif." +  uuidv4() + ".txt";
  const mrkt = "PLACE;"+nameofAccount+";<INS>;<ACT>;<QTY>;MARKET;<LIMIT>;;DAY;;;;";
  var ordr = mrkt.replace("<INS>","NQ 06-24").replace("<ACT>",action).replace("<QTY>",amount);
  if( Currentvalues['action'].includes("FLAT")){
     ordr = "CLOSEPOSITION;<ACCOUNT>;<INSTRUMENT>;;;;;;;;;;".replace("<ACCOUNT>",nameofAccount).replace("<INSTRUMENT>","NQ 06-24");
  }

  fs.writeFileSync(path,ordr);

  // if (currentAction === 'long' && prevAction === 'long') {
  //     return currentAmount > prevAmount ? { action: 'buy', amount: currentAmount - prevAmount } : { action: 'sell', amount: prevAmount - currentAmount };
  // }

  // if (currentAction === 'short' && prevAction === 'short') {
  //     return currentAmount > prevAmount ? { action: 'sell', amount: currentAmount - prevAmount } : { action: 'buy', amount: prevAmount - currentAmount };
  // }

  // if (prevAction === 'flat') {
  //     return currentAction === 'long' ? { action: 'buy', amount: currentAmount } : { action: 'sell', amount: currentAmount };
  // }

  // if (currentAction === 'flat') {
  //     return prevAction === 'long' ? { action: 'sell', amount: prevAmount } : { action: 'buy', amount: prevAmount };
  // }
  PrevFunction['action'] = Currentvalues['action']
  PrevFunction['Amount'] = Currentvalues['Amount']

  return null;
}

const returnAction = (data) => {  
return data.includes('FLAT')? 'FLAT' :('LONG') ? 'BUY': 'SELL';
};

const returnAmount = (data) => {
return data.split(';')[1];
};
