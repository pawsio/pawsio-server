const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: add extra parameters as needed

const petSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    animal: {
        type: String
    },
    breed: {
        type: String
    },
    weight: {
        type: Number
    },
    age: {
        type: Number
    },
    exerciseNeed: {
        type: Number
    },
    distanceGoal: {
        type: Number
    },
    usernameId: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    owner: {
        type: String,
        required: true
    },
    data: []
});

module.exports = mongoose.model('Pets', petSchema);
