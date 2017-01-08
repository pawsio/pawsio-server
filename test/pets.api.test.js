const app = require('../lib/app');
const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const connection = require('./test-setup-mongoose');

chai.use(chaiHttp);

describe('tests pets endpoint on server', () => {
    
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
        owner: '',
        data: []
    };

    const update = {
        animal: 'motorrad'
    };

    let userToken = '';

    before(done => {
        request
            .post('/api/users/signup')
            .send(testUser)
            .then(res => {
                assert.equal(res.body.username, testUser.username);
                userToken = res.body.token;
                newPet.owner = res.body.username;
                done();
            })
            .catch(done);
    });

    it('posts a new pet', done => {
        request
            .post('/api/pets')
            .set('authorization', `Bearer ${userToken}`)
            .send(newPet)
            .then(res => {
                assert.isOk(res.body._id);
                newPet.__v = 0;
                newPet.usernameId = res.body.usernameId;
                newPet._id = res.body._id;
                assert.deepEqual(res.body, newPet);
                done();
            })
            .catch(done);
    });

    it('gets a single pet based on id', done => {
        request
            .get(`/api/pets/${newPet._id}`)
            .set('authorization', `Bearer ${userToken}`)
            .then(res => {
                assert.deepEqual(res.body, newPet);
                done();
            })
            .catch(done);
    });

    it('gets a user and all pets related to that user', done => {
        request
            .get('/api/pets/all')
            .set('authorization', `Bearer ${userToken}`)
            .then(res => {
                assert.equal(res.body.username, testUser.username);
                assert.equal(res.body.pets.length, 1);
                done();
            })
            .catch(done);
    });

    it('gets a pet based on a query string', done => {
        request
            .get(`/api/pets?owner=${testUser.username}&name=${newPet.name}`)
            .set('authorization', `Bearer ${userToken}`)
            .then(res => {
                assert.equal(res.body.length, 1);
                assert.deepEqual(res.body[0], newPet);
                done();
            })
            .catch(done);
    });

    it('puts new updated info on new pet', done => {
        request
            .put(`/api/pets/${newPet._id}`)
            .set('authorization', `Bearer ${userToken}`)
            .send(update)
            .then(res => {
                assert.isOk(res.body);
                newPet.animal = update.animal;
                assert.deepEqual(res.body, newPet);
                done();
            })
            .catch(done);
    });

    it('deletes pet from database', done => {
        request
            .del(`/api/pets/${newPet._id}`)
            .set('authorization', `Bearer ${userToken}`)
            .then(res => {
                assert.deepEqual(res.body, newPet);
                done();
            })
            .catch(done);
    });

    it('makes sure that pet was removed', done => {
        request
            .get(`/api/pets/${newPet._id}`)
            .set('authorization', `Bearer ${userToken}`)
            .then(res => {
                assert.deepEqual(res.body, {});
                done();
            })
            .catch(done);
    });
});