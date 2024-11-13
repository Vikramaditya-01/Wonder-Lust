const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const listing = require('./models/listing.js');



/// Database Connection
const MONGOURL = "mongodb://127.0.0.1:27017/Wonderlust";

main().then(() => console.log('Connected to database')).catch(err => console.error(err));
async function main() {
    await mongoose.connect(MONGOURL);
}   



app.get('/', (req, res) => {
    res.send('Hii i am root');
});

app.get('/listingtest', async(req, res) => {
   let listing1 = new listing({
       title: "Test Title",
       description: "Test Description",
       price: 100,
       location: "Test Location",
       country: "Test Country",
   });
    await listing1.save();
    console.log('Listing created');
    console.log(listing1);
    
    
    res.send(listing1);
});





app.listen(8080, () => {
    console.log('Server is running on port 8000');
});