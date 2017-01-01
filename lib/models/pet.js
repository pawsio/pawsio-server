const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// TODO: add extra parameters as needed

const petSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    animal: {
        type: String
    },
    usernameId: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    owner: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Pets', petSchema);