const router = require('express').Router();
const bodyParser = require('body-parser').json();

router
    .get('/', bodyParser, (req, res, next) => {
        const message = 'hi from get';
        res.send({message});
    })
    .put('/', bodyParser, (req, res, next) => {
        const message = 'hi from put';
        res.send({message});
    })
    .post('/', bodyParser, (req, res, next) => {
        console.log(req.body);
        const newmessage = 'hi from post';
        res.send({newmessage});
    })
    .delete('/', bodyParser, (req, res, next) => {
        const message = 'hi from delete';
        res.send({message});
    });

module.exports = router;
