const express = require('express');
const router = express.Router();
const listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync');
const expressError = require('../utils/expressError');
const { listingSchema } = require('../schema.js');
const { isLoggedIn } = require('../middleware.js');


const validateListing = (req, res, next) => {    /// middleware for Validate the listing schema using Joi
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errorMessages = error.details.map(el => el.message).join(',');
        throw new expressError(errorMessages, 400);
    } else {
        next();
    }
};


// index route
router.get('/', wrapAsync(async (req, res) => {
        let listings = await listing.find({});
        res.render('listings/index', { listings });
}));

// New route
router.get('/new', isLoggedIn , (req, res) => {
    res.render('listings/new');
});

// Show route
router.get('/:id', wrapAsync(async (req, res , next) => {
        let { id } = req.params;
        const listings = await listing.findById(id).populate('reviews').populate('owner');
        if (!listings) {
            req.flash('error', 'listing you requested for does not exist!');
            return res.redirect('/listings');
        }
        res.render('listings/show', { listings });
}));

// Create route
router.post('/', isLoggedIn , validateListing, wrapAsync(async (req, res) => {  ///use middleware to validate the listing schema
const Newlisting = new listing(req.body.listing);
Newlisting.owner = req.user._id;
await Newlisting.save();
req.flash('success', 'Successfully made a new listing!');
res.redirect(`/listings`);
}));

// Edit route
router.get('/:id/edit', isLoggedIn , wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listings = await listing.findById(id);
    if (!listings) {
        req.flash('error', 'listing you requested for does not exist!');
        return res.redirect('/listings');
    }
    res.render('listings/edit', { listings });
}));

// Update route
router.put('/:id', isLoggedIn ,  validateListing, wrapAsync(async (req, res) => {   ///use middleware to validate the listing schema
    let { id } = req.params;
    await listing.findByIdAndUpdate(id , { ...req.body.listing });
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings`);
}));

// Delete route
router.delete('/:id', isLoggedIn , wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted the listing!");
    res.redirect('/listings');
}));


module.exports = router;