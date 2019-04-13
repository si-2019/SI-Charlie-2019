//chai
var chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
//

const  app = require('./index.js');

describe('pokreni server', () => {
  it('dobavlja predmete', (done) => {
    chai.request(app)
    .get('/api/predmeti')
    .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.lengthOf(3);
        done();
    })
  });
});