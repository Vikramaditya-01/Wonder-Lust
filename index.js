const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const expressError = require('./utils/expressError');
const { listingSchema , reviewSchema } = require('./schema.js');
const Review = require('./models/review.js');

// Set & use engines and directorys
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


const validateListing = (req, res, next) => {    /// middleware for Validate the listing schema using Joi
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errorMessages = error.details.map(el => el.message).join(',');
        throw new expressError(errorMessages, 400);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {    /// middleware for Validate the review schema using Joi
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errorMessages = error.details.map(el => el.message).join(',');
        console.log(error);
        
        
        throw new expressError(errorMessages, 400);
    } else {
        next();
    }
}

// Database Connection
const MONGOURL = "mongodb://127.0.0.1:27017/Wonderlust";
main().then(() => console.log('Connected to database')).catch(err => console.error(err));

async function main() {
    await mongoose.connect(MONGOURL);
}

///////// Routes////

// Root route
app.get('/', (req, res) => {
    res.send('Hii I am root');
});

//// index route
app.get('/listings', wrapAsync(async (req, res) => {
        let listings = await listing.find({});
        res.render('listings/index', { listings });
}));

// New route
app.get('/listings/new', (req, res) => {
    res.render('listings/new');
});

// Show route
app.get('/listings/:id', wrapAsync(async (req, res , next) => {
        let { id } = req.params;
        const listings = await listing.findById(id).populate('reviews');
        res.render('listings/show', { listings });
}));

// Create route
app.post('/listings', validateListing, wrapAsync(async (req, res) => {  ///use middleware to validate the listing schema
const Newlisting = new listing(req.body.listing);
await Newlisting.save();
res.redirect(`/listings`);
}));

// Edit route
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listings = await listing.findById(id);
    res.render('listings/edit', { listings });
}));

// Update route
app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {   ///use middleware to validate the listing schema
    let { id } = req.params;
    await listing.findByIdAndUpdate(id , { ...req.body.listing });
    res.redirect(`/listings`);
}));

// Delete route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

// review 
// post route
app.post('/listings/:id/reviews', validateReview, wrapAsync(async (req, res) => {
    let foundListing = await listing.findById(req.params.id);
    let newreview = new Review(req.body.Review);

    foundListing.reviews.push(newreview);
    await newreview.save();
    await foundListing.save();
    console.log(newreview);
    res.redirect(`/listings/${foundListing._id}`);
}));


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
