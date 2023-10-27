const mongoose = require('mongoose');

const shortUrlSchema = mongoose.Schema({
    fullUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    expiresAfter: {
        type: Date,
        required: true
    }
})


module.exports = mongoose.model('ShortUrl', shortUrlSchema)