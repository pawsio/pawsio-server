const app = require('../lib/app');
const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const connection = require('./test-setup-mongoose');
const petModel = require('../lib/models/pet');

chai.use(chaiHttp);

describe('tests users endpoint on server', () => {
    
    before(done => {
        const drop = () => connection.db.dropDatabase(done);
        if(connection.readyState === 1) drop();
        else connection.on('open', drop);
    });

    const request = chai.request(app);

    const testUser = {
        username: 'kino',
        password: 'tabi'
    };

    const newPet = {
        name: 'hermes',
        animal: 'motorcycle',
        usernameId: '',
        owner: ''
    };

    let userToken = '';

    before(done => {
        request
            .post('/api/users/signup')
            .send(testUser)
            .then(res => {
                assert.equal(res.body.username, testUser.username);
                userToken = res.body.token;
                newPet.usernameId = res.body._id;
                newPet.owner = res.body.username;
                done();
            })
            .catch(done);
    });

    it('posts a new pet', done => {
        request
            .post('/api/pets/')
            .set('authorization', `Bearer ${userToken}`)
            .send(newPet)
            .then(res => {
                console.log(res.body);
                done();
            })
            .catch(done);
    });
});