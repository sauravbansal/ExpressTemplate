/**
 * Module dependencies.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../bin/www');

/* 
 * Gobal variables
 */

const should = chai.should();

/* 
 * Test middleware functions
 */

chai.use(chaiHttp);

/* 
 * Test groups
 */

describe('/', () => {
    describe('GET /', () => {
        it('Check website root', function (done) {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});