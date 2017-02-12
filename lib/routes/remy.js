const router = require('express').Router();
const bodyParser = require('body-parser').json();
const petModel = require('../models/pet');
const petSnapshotModel = require('../models/pet-snapshot');
const remy = process.env.REMY || 'Remy';

router
    .get('/', bodyParser, (req, res, next) => {
        petModel
            .findById(remy)
            .lean()
            .then(remy => {
                res.send(remy);
            })
            .catch(next);
    })
    .get('/allwalks', bodyParser, (req, res, next) => {
        const dataPoints = 50; // arbitrary number of data dataPoints
        if (remy !== 'Remy') {
            Promise
                .all([
                    petModel
                        .findById(remy).lean(),
                    petSnapshotModel
                        .find({animalId: remy}).select('_id date animalId snapshotName')
                        .sort('date').limit(dataPoints).lean()
                ])
                .then(([pet,data]) => {
                    pet.data = data;
                    res.send(pet);
                })
                .catch(next);
        } else {
            Promise
                .all([
                    petModel
                        .findOne({name: remy}).lean(),
                    petSnapshotModel
                        .find({name: remy}).select('_id data animalId snapshotName')
                        .sort('date').limit(dataPoints).lean()
                ])
                .then(([pet,data]) => {
                    pet.data = data;
                    res.send(pet);
                })
                .catch(next);
        };
    })
    .get('/allwalks/:id', bodyParser, (req, res, next) => {
        const id = req.params.id;
        petSnapshotModel
            .findById(id)
            .lean()
            .then(snapshot => {
                res.send(snapshot);
            })
            .catch(next);
    });

module.exports = router;