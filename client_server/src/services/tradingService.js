const fs = require('fs');
const path = require('path');
const os = require('os');

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

function getSettingsPath(accountName) {
    return path.join(getUserDocumentsPath(), "NinjaTrader 8", "outgoing", `NQ 06-24 Globex_${accountName}_position.txt`);
}

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

function buyOrSell(accountName, data) {
    const SettingsPath = getSettingsPath(accountName);

    fs.readFile(SettingsPath.replace(settings.source, accountName), 'utf8', (err, OldFileData) => {
        if (err) {
            console.error(err);
            return;
        }

        PrevFunction["action"] = OldFileData.includes('LONG') ? 'BUY': 'SELL';
        PrevFunction["Amount"] = OldFileData.split(';')[1];
    });

    fs.readFile(SettingsPath, 'utf8', (err, settingsData) => {
        Currentvalues = returnCurrentValues(settingsData);

        if (!PrevFunction["Amount"]) {
            PrevFunction["Amount"] = 0;
        }

        let action = Currentvalues["action"];
        let amount = Currentvalues["Amount"] - PrevFunction["Amount"];

        if (Currentvalues["Amount"] - PrevFunction["Amount"] < 0) {
            action = action.includes("SELL") ? "BUY" : "SELL";
            amount = -amount;
        }

        const _path =  path.join(getUserDocumentsPath(), `NinjaTrader 8\\incoming\\oif.${uuidv4()}.txt`);
        const mrkt = "PLACE;" + accountName + ";NQ 06-24;<ACT>;<QTY>;MARKET;<LIMIT>;;DAY;;;;";
        let ordr = mrkt.replace("<ACT>", action).replace("<QTY>", amount);

        if (settingsData.includes("FLAT")) {
            ordr = `CLOSEPOSITION;${accountName};NQ 06-24;;;;;;;;;;`;
        }

        fs.writeFileSync(_path, ordr);
    });
}

module.exports = {
    buyOrSell
};
