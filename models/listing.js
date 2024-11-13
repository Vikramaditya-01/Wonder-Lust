const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    image: {
        filename: {
            type: String,
            default: 'defaultImage'
        },
        url: {
            type: String,
            default: "https://unsplash.com/photos/a-large-castle-like-building-with-a-clock-tower-nsXv1nWfQ2c"
        }
    },
    price : {
        type: Number,
        required: true
    },
    location : {
        type: String,
        required: true
    },
    country : {
        type: String,
        required: true
    },
});

const Listing = mongoose.model('Listing', listingSchema);  // Listing is the name of the model
module.exports = Listing;