const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing.js');  // Fixed model reference
const wrapAsync = require('../utils/wrapAsync');
const Review = require('../models/review.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

// POST route for reviews
router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let foundListing = await Listing.findById(req.params.id);  // Fixed model reference
    let newReview = new Review(req.body.Review);
    newReview.author = req.user._id;
    foundListing.reviews.push(newReview);
    await newReview.save();
    await foundListing.save();
    req.flash('success', "Successfully added a new review!");
    res.redirect(`/listings/${foundListing._id}`);
}));

// DELETE route for reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    
    // Pull review from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    // Delete review from database
    await Review.findByIdAndDelete(reviewId);
    
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
