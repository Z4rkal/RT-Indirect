const chai = require('chai');
const { expect } = require('chai');
const chai_http = require('chai-http');

chai.use(chai_http);

const server = require('../server/server');

describe('Server', () => {
    it('should respond with a 200', () => {
        chai.request(server)
            .get('/')
            .then(response => expect(response.status).to.eq(200))
            .catch(err => { throw err; });
    });
});