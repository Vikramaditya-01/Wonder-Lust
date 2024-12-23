const listing = require('../models/listing');

module.exports.index = async (req, res) => {
    let listings = await listing.find({});
    res.render('listings/index', { listings });
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
}

module.exports.showListing = async (req, res , next) => {
    let { id } = req.params;
    const listings = await listing.findById(id).populate({path :'reviews' , populate : {path : 'author'}}).populate('owner');
    if (!listings) {
        req.flash('error', 'listing you requested for does not exist!');
        return res.redirect('/listings');
    }
    res.render('listings/show', { listings });
}

module.exports.createListing = async (req, res) => { 
    let url = req.file.path;
    let filename = req.file.filename;
    const Newlisting = new listing(req.body.listing);
    Newlisting.owner = req.user._id;
    Newlisting.image = { url , filename };
    await Newlisting.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect(`/listings`);
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listings = await listing.findById(id);
    if (!listings) {
        req.flash('error', 'listing you requested for does not exist!');
        return res.redirect('/listings');
    }
    res.render('listings/edit', { listings });
}

module.exports.updateListing = async (req, res) => { 
    let { id } = req.params;
    await listing.findByIdAndUpdate(id , { ...req.body.listing });
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted the listing!");
    res.redirect('/listings');
}