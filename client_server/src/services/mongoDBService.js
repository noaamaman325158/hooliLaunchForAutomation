const mongoose = require('mongoose');

const MacAddress = require('../model/macAddress')

const fetchMacAddresses = async () => {
    console.log('Inside the fetch mac adress fuinction ..')
    try {
        const macAddresses = await MacAddress.find({});
        console.log('MAC addresses:', macAddresses);
    } catch (error) {
        console.error('Error fetching MAC addresses:', error);
    }
};

const checkMacAddressExists = async (inputMacAddress) => {
    console.log('Inside the check mac address fucntion ...');
    try {
        const result = await MacAddress.findOne(inputMacAddress);

        if (result) {
            console.log(`MAC address ${inputMacAddress} exists in the database.`);
            return true;
        } else {
            console.log(`MAC address ${inputMacAddress} does not exist in the database.`);
            return false;
        }
    } catch (error) {
        console.error('Error checking MAC address:', error);
        return false;
    }
};

module.exports = { fetchMacAddresses, checkMacAddressExists };
