const express = require('express');
const router = express.Router({ mergeParams: true });
const listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync');
const Review = require('../models/review.js');
const { validateReview, isLoggedIn } = require('../middleware.js');

//post route for review
router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let foundListing = await listing.findById(req.params.id);
    let newreview = new Review(req.body.Review);
    newreview.author = req.user._id;~
    foundListing.reviews.push(newreview);
    await newreview.save();
    await foundListing.save();
    req.flash('success', "Successfully added a new review!");
    res.redirect(`/listings/${foundListing._id}`);
}));
// delete route for review
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/listings/${id}`);
}));

module.exports = router;