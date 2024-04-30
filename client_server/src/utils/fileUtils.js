const fs = require('fs');
const path = require('path');

function appendToFile(content, accountName) {
    const homedir = os.homedir();
    const localFilePath = path.join(homedir, 'Documents', `NinjaTrader 8/outgoing/NQ 06-24 Globex_${accountName}_position.txt`);

    fs.appendFile(localFilePath, `${content}\n`, (err) => {
        if (err) {
            console.error('Error appending to local file:', err);
            return;
        }
        console.log('Change appended to local file.');
    });
}

module.exports = {
    appendToFile
};
