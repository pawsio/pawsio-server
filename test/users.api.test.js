const app = require('../lib/app');
const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const connection = require('./test-setup-mongoose');
const userModel = require('../lib/models/user');

chai.use(chaiHttp);

describe('tests users endpoint on server', () => {
    
    before(done => {
        const drop = () => connection.db.dropDatabase(done);
        if(connection.readyState === 1) drop();
        else connection.on('open', drop);
    });

    before(done => {
        const daAdmin = {
            username: 'DaMan',
            password: 'DaBoss',
            roles: ['admin']
        };
        const newAdmin = new userModel(daAdmin);
        newAdmin.generateHash(daAdmin.password);
        newAdmin.save(done);
    });

    const request = chai.request(app);

    function badRequest(url, send, error, done){
        request
          .post(url)
          .send(send)
          .then(() => done('status should not be 200'))
          .catch(res => {
              assert.equal(res.status, 400);
              assert.equal(res.response.body.error, error);
              done();
          })
          .catch(done);
    };

    const badUserOne = {
        username: 'whatever'
    };

    const badUserTwo = {
        password: 'whatever'
    };

    const badUserThree = {
        username: 'whatever',
        password: 'whatever',
        roles: ['admin']
    };

    const goodUser = {
        username: 'doko',
        password: 'desu'
    };

    let userToken = '';
    let adminToken = '';

    it('ensures you need a password with posted username', done => {
        badRequest('/api/users/signup', badUserOne, 'Valid username and password required', done);
    });

    it('ensures you need a username with posted password', done => {
        badRequest('/api/users/signup', badUserTwo, 'Valid username and password required', done);
    });

    it('ensures you cannot add a role to yourself', done => {
        badRequest('/api/users/signup', badUserThree, 'user cannot designate role on signup', done);
    });

    it('returns the username and token when a valid signup is made', done => {
        request
            .post('/api/users/signup')
            .send(goodUser)
            .then(res => {
                assert.equal(res.body.username, goodUser.username);
                assert.isOk(res.body.token);
                userToken = res.body.token;
                done();
            })
            .catch(done);
    });

    it('ensures you cannot have users with the same usernames', done => {
        badRequest('/api/users/signup', goodUser, `Username ${goodUser.username} already exists`, done);
    });

    it('returns a token when user signs back up with the server', done => {
        request
            .post('/api/users/signin')
            .send(goodUser)
            .then(res => {
                assert.isOk(res.body.token);
                userToken = res.body.token;
                done();
            })
            .catch(done);
    });

    it('returns error when you have incorrect signin', done => {
        badRequest('/api/users/signin', badUserTwo, 'Invalid username or password', done);
    });

    it('returns valid true if token is valid for good user', done => {
        request
            .post('/api/users/validate')
            .set('Authorization', `Bearer ${userToken}`)
            .then(res => {
                assert.equal(res.body.valid, true);
                assert.equal(res.body.username, goodUser.username);
                done();
            })
            .catch(done);
    });

    // TODO: test delete pathways for admins
});