const mongoose = require('mongoose');

const uri = "mongodb+srv://ninjaBroadcast:uLv8vKDHER6CvHG8@cluster0.khjrocu.mongodb.net/NinjaTraderApp";

async function connectToDatabase() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error("Could not connect to MongoDB:");
        console.error("Error name: ", err.name);
        console.error("Error message: ", err.message);
        console.error("Error stack: ", err.stack);
    }
}

const macAddressSchema = new mongoose.Schema({
    name: String,
    mac1: String,   // Assuming your documents have 'mac1' and 'mac2'
    mac2: String
});

const MacAddress = mongoose.model('MacAddress', macAddressSchema, 'mac_addresses');

async function fetchMacAddresses() {
    try {
        const macAddresses = await MacAddress.find({});
        console.log('MAC addresses:', macAddresses);
    } catch (err) {
        console.error('Error fetching MAC addresses:', err);
    }
}

async function checkMacAddressExists(inputMacAddress) {
    try {
        const result = await MacAddress.findOne({
            $or: [
                { mac1: inputMacAddress },
                { mac2: inputMacAddress }
            ]
        });

        if (result) {
            console.log(`MAC address ${inputMacAddress} exists in the database.`);
            return true;
        } else {
            console.log(`MAC address ${inputMacAddress} does not exist in the database.`);
            return false;
        }
    } catch (err) {
        console.error('Error checking MAC address:', err);
        return false;
    }
}

async function runChecks() {
    await fetchMacAddresses();
    const exists = await checkMacAddressExists('00:50:56:3f:ee:07');
    console.log(`MAC address exists: ${exists}`);
}

connectToDatabase().then(runChecks);

mongoose.connection.on('connected', () => console.log('Mongoose connected to MongoDB'));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Connection closed due to app termination');
    process.exit(0);
});
