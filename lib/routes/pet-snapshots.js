const router = require('express').Router();
const bodyParser = require('body-parser').json();
const petModel = require('../models/pet');
const petSnapshotModel = require('../models/pet-snapshot');

router
    .get('/:id', bodyParser, (req, res, next) => {
        const id = req.params.id;
        const datapoints = 50; //arbitrary number of data points
        Promise
            .all([
                petModel
                    .findById(id)
                    .lean(),
                petSnapshotModel
                    .find({animalId: id})
                    .sort('-date')
                    .limit(datapoints) 
            ])
            .then(([pet,data]) => {
                pet.data = data;
                res.send(pet);
            })
            .catch(next);
    })
    .post('/', bodyParser, (req, res, next) => {
        new petSnapshotModel(req.body).save()
            .then(data => {
                res.send(data);
            })
            .catch(next);
    })
    .delete('/:id', bodyParser, (req, res, next) => {
        petSnapshotModel
            .findByIdAndRemove(req.params.id)
            .then(removedData => {
                res.send(removedData);
            })
            .catch(next);
    });

module.exports = router;
