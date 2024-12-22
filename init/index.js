const mongoose = require('mongoose');

const initData = require('./data.js');
const Listing = require('../models/listing.js');

/// Database Connection
const MONGOURL = "mongodb://127.0.0.1:27017/Wonderlust";

main().then(() => console.log('Connected to database')).catch(err => console.error(err));
async function main() {
    await mongoose.connect(MONGOURL);
}   

const Data = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner: '67674aa5d3d8e6d987deed38'}));
    await Listing.insertMany(initData.data);
    console.log('Data inserted');
};

Data();  // This will insert the data into the database
