const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: add extra parameters as needed

const petSnapshotSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    snapshotName: {
        type: String
    },
    animalId: {
        type: Schema.Types.ObjectId,
        ref: 'Pets'
    },
    date: {
        type: Date,
        default: Date.now
    },
    temperature: {
        type: Number
    },
    dataPayload: []
});

module.exports = mongoose.model('PetSnapshots', petSnapshotSchema);
