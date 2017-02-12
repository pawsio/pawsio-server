const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler');
const users = require('./routes/users');
const tests = require('./routes/tests');
const pets = require('./routes/pets');
const petSnapShots = require('./routes/pet-snapshots');
const remy = require('./routes/remy');
const ensureAuth = require('./auth/ensure-auth')();

app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log('setting cors headers');
    const url = '*';
    res.header('Access-Control-Allow-Origin', url);
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

if(process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if(req.headers['x-forwarded-proto'] === 'https') next();
        else res.redirect(`https://${req.hostname}${req.url}`);
    });
};

app.use(express.static('./public'));
app.use('/api/users', users);
app.use('/api/tests', tests);
app.use('/api/pets', ensureAuth, pets);
app.use('/api/pet-snapshots', ensureAuth, petSnapShots);
app.use('/api/remy', remy);
app.use(errorHandler);

module.exports = app;