// models/macAddress.js
const mongoose = require('mongoose');

const macAddressSchema = new mongoose.Schema({
    name: String,
    mac_address: String
});

module.exports = mongoose.model('MacAddress', macAddressSchema, 'mac_addresses');
