// utils.js
const os = require('os');
const path = require('path');

function getMacAddress() {
    return new Promise((resolve, reject) => {
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

        // Check if a MAC address was found
        if (macAddress) {
            resolve(macAddress);
        } else {
            reject(new Error('Failed to retrieve MAC address'));
        }
    });
}

function extractAccountName(filePath) {
    const pattern = /Globex_(.+?)_position\.txt$/;
    const match = filePath.match(pattern);

    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}

module.exports = { getMacAddress, extractAccountName };
