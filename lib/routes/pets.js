const router = require('express').Router();
const bodyParser = require('body-parser').json();
const userModel = require('../models/user');
const petModel = require('../models/pet');

router
    .get('/:id', bodyParser, (req, res, next) => {
        const _id = req.params.id;
        petModel
            .findById({_id})
            .lean()
            .then(pet => {
                res.send(pet)
            })
            .catch(next);
    })
    .get('/', bodyParser, (req, res, next) => {
        // from ensure-auth
        const owner = req.user.username;
        const _id = req.user._id;
        Promise
            .all([
                userModel
                    .findById({_id})
                    .select('username pets')
                    .lean(),
                petModel
                    .find({owner})
            ])
            .then(([user,pets]) => {
                user.pets = pets;
                res.send(user);
            })
            .catch(next);
    })
    .post('/', bodyParser, (req, res, next) => {
        const {_id, user} = req.user;
        req.body.usernameId = _id;
        req.body.owner = user;
        new petModel(req.body).save()
            .then(pet => {
                res.send(pet);
            })
            .catch(next);
    })
    .put('/:id', bodyParser, (req, res, next) => {
        petModel
            .findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true //not sure if need this
            })
            .then(savedPet => {
                res.send(savedPet);
            })
            .catch(next);
    })
    .delete(':/id', bodyParser, (req, res, next) => {
        petModel
            .findByIdAndRemove(req.params.id)
            .then(removedPet => {
                //send a confirmation message?
                res.send(removedPet);
            })
            .catch(next);
    });

module.exports = router;