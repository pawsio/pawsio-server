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

    const snapShotOne = {
        name: newPet.name,
        animalId: '',
        dataPayload: [1,2,3]
    };

    const snapShotTwo = {
        name: newPet.name,
        animalId: '',
        dataPayload: [4,5,6]
    };

    const snapShotThree = {
        name: newPet.name,
        animalId: '',
        dataPayload: [7,8,9]
    };

    let allUpdates = [snapShotOne, snapShotTwo, snapShotThree];

    let hikeName = {
        snapshotName: 'whatever'
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
                done();
            })
            .catch(done);
    };

    it('posts first data', done => {
        postData(snapShotOne, newPet._id, userToken, done);
    });

    it('posts second data', done => {
        postData(snapShotTwo, newPet._id, userToken, done);
    });

    it('posts third data', done => {
        postData(snapShotThree, newPet._id, userToken, done);
    });

    it('gets pet and list of snapshots taken that are sorted by date', done => {
        request
            .get(`/api/pet-snapshots/${newPet._id}/all`)
            .set('authorization', `Bearer ${userToken}`)
            .then(res => {
                let data = res.body.data;
                assert.equal(data.length, allUpdates.length);
                assert.isAbove(data[data.length - 1].date, data[0].date);
                snapShotOne._id = data[0]._id;
                snapShotOne.animalId = data[0].animalId;
                snapShotOne.date = data[0].date;
                snapShotOne.__v = 0;
                done();
            })
            .catch(done);
    });

    it('gets a specific snapshot as identified by id', done => {
        request
            .get(`/api/pet-snapshots/${snapShotOne._id}`)
            .set('authorization', `Bearer ${userToken}`)
            .then(res => {
                assert.deepEqual(res.body, snapShotOne);
                done();
            })
            .catch(done);
    });

    it('puts a new update to a given snapshot based on id', done => {
        request
            .put(`/api/pet-snapshots/${snapShotOne._id}`)
            .set('authorization', `Bearer ${userToken}`)
            .send(hikeName)
            .then(res => {
                assert.equal(res.body.snapshotName, hikeName.snapshotName);
                snapShotOne.snapshotName = hikeName.snapshotName;
                done();
            })
            .catch(done);
    });

    it('deletes a specific snapshot from the database', done => {
        request
            .del(`/api/pet-snapshots/${snapShotOne._id}`)
            .set('authorization', `Bearer ${userToken}`)
            .then(res => {
                assert.isOk(res.body);
                assert.deepEqual(res.body, snapShotOne);
                done();
            })
            .catch(done);
    });

    it('makes sure snapshot was indeed removed', done => {
        request
            .get(`/api/pet-snapshots/${newPet._id}/all`)
            .set('authorization', `Bearer ${userToken}`)
            .then(res => {
                assert.equal(res.body.data.length, allUpdates.length - 1);
                done();
            })
            .catch(done);
    });
});