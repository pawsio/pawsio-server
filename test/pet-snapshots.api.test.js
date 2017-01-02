const app = require('../lib/app');
const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const connection = require('./test-setup-mongoose');

chai.use(chaiHttp);

describe('tests pet snapshots endpoint on server', () => {
    
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

    const updateOne = {
        name: newPet.name,
        temperature: 98
    };

    const updateTwo = {
        name: newPet.name,
        temperature: 99
    };

    const updateThree = {
        name: newPet.name,
        temperature: 100
    };

    const allUpdates = [updateOne, updateTwo, updateThree];

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

    before(done => {
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

    function postData(data, petId, token, done) {
        request
            .post(`/api/pet-snapshots/${petId}`)
            .set('authorization', `Bearer ${token}`)
            .send(data)
            .then(res => {
                assert.isOk(res.body);
                assert.equal(res.body.name, data.name);
                assert.equal(res.body.temperature, data.temperature);
                done();
            })
            .catch(done);
    };

    it('posts first data', done => {
        postData(updateOne, newPet._id, userToken, done);
    });

    it('posts second data', done => {
        postData(updateTwo, newPet._id, userToken, done);
    });

    it('posts third data', done => {
        postData(updateThree, newPet._id, userToken, done);
    });

    it('gets pet along with time data', done => {
        request
            .get(`/api/pet-snapshots/${newPet._id}`)
            .set('authorization', `Bearer ${userToken}`)
            .then(res => {
                let data = res.body.data;
                assert.equal(data.length, allUpdates.length);
                assert.isAbove(data[0].date, data[data.length - 1].date);
                done();
            })
            .catch(done);
    });

    it('deletes all data related to this pet', done => {
        request
            .del(`/api/pet-snapshots/${newPet._id}`)
            .set('authorization', `Bearer ${userToken}`)
            .then(res => {
                assert.isOk(res.body.ok);
                assert.equal(res.body.n, allUpdates.length);
                done();
            })
            .catch(done);
    });

    it('makes sure all data related to the pet was removed', done => {
        request
            .get(`/api/pet-snapshots/${newPet._id}`)
            .set('authorization', `Bearer ${userToken}`)
            .then(res => {
                let data = res.body.data;
                assert.equal(data.length, 0);
                done();
            })
            .catch(done);
    });
});