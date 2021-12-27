const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    originalUrl:{
        type: String,
        unique: true,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
    },
    visits: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('url', urlSchema);