 
const { connectToDatabase } = require('./path/to/connectToDatabase');
const { connectToServer } = require('./services/socketHandler');

const uri = "mongodb+srv://ninjaBroadcast:uLv8vKDHER6CvHG8@cluster0.khjrocu.mongodb.net/hooli_project";

connectToDatabase(uri);

module.exports = connectToServer();
