const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listing = require('./models/listing.js');
const path = require('path');

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database Connection
const MONGOURL = "mongodb://127.0.0.1:27017/Wonderlust";
main().then(() => console.log('Connected to database')).catch(err => console.error(err));

async function main() {
    await mongoose.connect(MONGOURL);
}

// Routes
app.get('/', (req, res) => {
    res.send('Hii I am root');
});

//// index route
app.get('/listings', async (req, res) => {
    try {
        let listings = await listing.find({});
        res.render('listings/index', { listings });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching listings');
    }
});

// Show route


// Server listening
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
