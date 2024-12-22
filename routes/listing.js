const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn , isOwner , validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings');

router
.route('/')
.get(wrapAsync(listingController.index)) // index route
.post(isLoggedIn , validateListing, wrapAsync(listingController.createListing)); // create route

// New route
router.get('/new', isLoggedIn , listingController.renderNewForm);

router
.route('/:id')
.get(wrapAsync(listingController.showListing)) // show route
.put(isLoggedIn , isOwner , validateListing, wrapAsync(listingController.updateListing)) // update route
.delete(isLoggedIn , isOwner , wrapAsync(listingController.deleteListing)); // delete route

// Edit route
router.get('/:id/edit', isLoggedIn , isOwner , wrapAsync(listingController.renderEditForm));
 
module.exports = router;