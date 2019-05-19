//chai
var chai = require("chai");
const should = chai.should()
chaiHttp = require("chai-http");
chai.use(chaiHttp);
//

const app = require("./server.js");

describe("pokreni server", () => {
  it("dobavlja predmete", done => {
    chai
      .request(app)
      .get("/api/predmeti")
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.lengthOf(3);
        done();
      });
  });

  it("dobavlja broj studenata na predmetu", done => {
    chai
      .request(app)
      .get("/dobavistudente/brojStudenata/Logički dizajn")
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.lengthOf(165);
        done();
      });
  });

  it("update ispita sa nepostojecim id/om", done => {
    chai
      .request(app)
      .patch("/ispit/888")
      .end((err, res) => {
        chai.expect(res).to.have.status(404)
        done()
      })
  })

  it("update ispita sa postojecim id/om", done => {
    const rokPrijave = Date.now()
    chai
      .request(app)
      .patch("/ispit/6")
      .send({rokPrijave})
      .end((err, res) => {
        chai.expect(res).to.have.status(200)
        res.body.success.should.be.eql('Uspjesan update!')
        done()
      })
  })
});
