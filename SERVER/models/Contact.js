const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    lastname: {
        type: String,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    message: {
        type: String,
        required: true,
        maxlength: 200
    }
});

module.exports = mongoose.model('Contact', ContactSchema);