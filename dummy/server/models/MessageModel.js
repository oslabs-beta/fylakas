// v-- REPLACE THE EMPTY STRING WITH YOUR LOCAL/MLAB/ELEPHANTSQL URI
const myURI = 'mongodb+srv://iamkaprekar:vlAQaAu26ZgAfWUp@default.w5akvxj.mongodb.net/?retryWrites=true&w=majority';

// UNCOMMENT THE LINE BELOW IF USING MONGO
const URI = process.env.MONGO_URI || myURI;

// UNCOMMENT THE LINE BELOW IF USING POSTGRESQL
// const URI = process.env.PG_URI || myURI;

const mongoose = require('mongoose');

// Adding this to aid in postman testing.
mongoose.connect('mongodb+srv://iamkaprekar:vlAQaAu26ZgAfWUp@default.w5akvxj.mongodb.net/?retryWrites=true&w=majority');

const messageSchema = new mongoose.Schema({
  message: {type: String, required: true},
  password: {type: String, required: true},
  created_at: {type: Date, default: Date.now()},
});

module.exports = mongoose.model('Message', messageSchema); // <-- export your model