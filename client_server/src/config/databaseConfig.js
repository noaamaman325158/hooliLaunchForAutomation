const mongoose = require('mongoose');

const connectToDatabase = async (uri) => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Could not connect to MongoDB:', error);
    }
};

module.exports = connectToDatabase;
