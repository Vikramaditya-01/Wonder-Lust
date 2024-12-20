const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressError = require('./utils/expressError');
const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js');


// Set & use engines and directorys
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


// Database Connection
const MONGOURL = "mongodb://127.0.0.1:27017/Wonderlust";
main().then(() => console.log('Connected to database')).catch(err => console.error(err));

async function main() {
    await mongoose.connect(MONGOURL);
}

//// Routes////

// Root route
app.get('/', (req, res) => {
    res.send('Hii I am root');
});

// Listing routes
app.use('/listings', listingRoutes);

// review routes
app.use('/listings/:id/reviews', reviewRoutes);

// 404 route
app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404));
});


// error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render("error.ejs", { err });
});


// Server listening
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
