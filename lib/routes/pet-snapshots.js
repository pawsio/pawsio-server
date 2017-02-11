const router = require('express').Router();
const bodyParser = require('body-parser').json();
const petModel = require('../models/pet');
const petSnapshotModel = require('../models/pet-snapshot');

router
    .get('/:animalId/all', bodyParser, (req, res, next) => {
        //get all data related to a specific pet
        const animalId = req.params.animalId;
        const dataPoints = 50; //arbitrary number of data points
        Promise
            .all([
                petModel
                    .findById(animalId)
                    .lean(),
                petSnapshotModel
                    .find({animalId})
                    .select('_id date animalId snapshotName')
                    .sort('date')
                    .limit(dataPoints)
                    .lean()
            ])
            .then(([pet,data]) => {
                pet.data = data;
                res.send(pet);
            })
            .catch(next);
    })
    .get('/:id', bodyParser, (req, res, next) => {
        // will get a specific snapshot
        const id = req.params.id;
        petSnapshotModel
            .findById(id)
            .lean()
            .then(snapshot => {
                res.send(snapshot);
            })
            .catch(next);
    })
    .put('/:id', bodyParser, (req, res, next) => {
        const id = req.params.id;
        petSnapshotModel
            .findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
            .then(snapshot => {
                res.send(snapshot);
            })
            .catch(next);
    })
    .post('/:animalId', bodyParser, (req, res, next) => {
        // body must contain the pets id
        req.body.animalId = req.params.animalId;
        new petSnapshotModel(req.body).save()
            .then(data => {
                let id = data._id;
                let name = data.name;
                res.send({id, name});
            })
            .catch(next);
    })
    .delete('/:id', bodyParser, (req, res, next) => {
        // deletes a specific snapshot
        petSnapshotModel
            .findByIdAndRemove(req.params.id)
            .then(removedData => {
                res.send(removedData);
            })
            .catch(next);
    });

module.exports = router;
