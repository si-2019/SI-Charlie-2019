const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 31903;

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./server/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
const Sequelize = require("sequelize");
const db = require("./db.js");
const Op = Sequelize.Op;
db.sequelize.sync();
//

app.use("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

//#region get zahtjev za broj odabranog tipa ispita odabranog predmeta
app.get("/predmet/:nazivPredmeta/:tipIspita", (req, res) => {
  db.Predmet.find({
    attributes: ["id", "naziv"],
    where: { naziv: req.params.nazivPredmeta }
  }).then(function(rez) {
    db.Ispit.findAndCountAll({
      where: { idPredmet: rez.id, tipIspita: req.params.tipIspita }
    }).then(function(count) {
      res.status(200);
      res.json(count);
    });
  });
});
//#endregion

//#region get zahtjev za predmete
app.get("/api/predmeti", (req, res) => {
  const predmeti = [
    { naziv: "Softverski inženjering", br_studenata: 150 },
    { naziv: "Logički dizajn", br_studenata: 165 },
    { naziv: "Računarske arhitekture", br_studenata: 170 }
  ];
  res.status(200);
  res.json(predmeti);
});
//#endregion

app.get("/jenkins-test", (req, res) => {
  res.send("Jenkins works!");
});

//#region get zahtjev za broj predmeta
app.get("/dobavistudente/brojStudenata/:naziv", (req, res) => {
  const predmeti = [
    { naziv: "Softverski inženjering", br_studenata: 150 },
    { naziv: "Logički dizajn", br_studenata: 165 },
    { naziv: "Računarske arhitekture", br_studenata: 170 }
  ];
  var br = 0;
  predmeti.forEach(predmet => {
    if (req.params.naziv == predmet.naziv) br = predmet.br_studenata;
  });
  res.status(200);
  res.json(br);
});
//#endregion

//#region get zahtjev za informacijama o ispitu
app.get("/ispit/:ispitID", async (req, res) => {
  const { ispitID } = req.params;
  try {
    const ispiti = await db.Ispit.findOne({ where: { idIspit: ispitID } });
    if (ispiti == null)
      return res.status(404).send({ error: "Ispit sa tim ID-em ne postoji!" });
    res.send(JSON.stringify(ispiti));
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
//#endregion

// vraća sve kreirane ispite za određenog profesora, ali koji još nisu prošli
app.get("/kreiraniIspiti/:profesorID", async (req, res) => {
  const { profesorID } = req.params;
  var trenutni = new Date();
  try {
    const ispiti = await db.Ispit.findAll({
      where: {
        idProfesor: profesorID,
        termin: {
          $gte: trenutni
        }
      }
    });
    if (ispiti == null)
      return res
        .status(404)
        .send({ error: "Profesor sa tim ID-om ne postoji!" });
    res.send(JSON.stringify(ispiti));
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// vraća sve kreirane ispite za određeni predmet
app.get("/kreiraniIspiti/predmet/:predmetID", async (req, res) => {
  const { predmetID } = req.params;
  var trenutni = new Date();
  try {
    const ispiti = await db.Ispit.findAll({
      where: {
        idPredmet: predmetID,
        termin: {
          $lte: trenutni
        }
      }
    });
    if (ispiti == null)
      return res
        .status(404)
        .send({ error: "Predmet sa tim ID-om ne postoji!" });
    res.send(JSON.stringify(ispiti));
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// kreiranje ispita je vec napravljeno
/*app.post('/ispit', (req, res) => {
  let v=req.body.ok;
  if(v) res.send("Uspjesno ste kreirali ispit");
  res.send("Doslo je do greske pri kreiranju ispita");
  
});
*/

//#region dobavljanje prijavljenih ispita odredjenog studenta

// app.get("/prijavljeniIspiti/:studentID", async (req, res) => {
//   const { studentID } = req.params;
//   try {
//     const rezultati = await db.IspitiRezultati.find({
//       korisnikIdKorisnik: studentID
//     });
//     if (!rezultati)
//       return res.send({ error: "Ne postoji student sa tim id-em!" });
//     res.send(JSON.stringify(rezultati));
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// });
//#endregion

app.post("/ispit", (req, res) => {
  var tijelo = req.body;
  var idProfesora = tijelo["idProfesor"];
  var idPredmeta = tijelo["idPredmet"];
  var brojStudenata = tijelo["brojStudenata"];
  var tipIspita = tijelo["tipIspita"];
  var rokPrijave = tijelo["rokPrijave"];
  var sala = tijelo["sala"];
  var termin = tijelo["termin"];
  var vrijemeTrajanja = tijelo["vrijemeTrajanja"];
  var kapacitet = tijelo["kapacitet"];
  var napomena = tijelo["napomena"];
  db.Ispit.insertOrUpdate({
    idProfesor: idProfesora,
    idPredmet: idPredmeta,
    brojStudenata: brojStudenata,
    tipIspita: tipIspita,
    rokPrijave: rokPrijave,
    sala: sala,
    termin: termin,
    vrijemeTrajanja: vrijemeTrajanja,
    kapacitet: kapacitet,
    napomena: napomena
  })
    .then(function(zapis) {
      if (zapis) res.send("Uspjesno unesen ispit!");
    })
    .catch(() => {
      res.status(409);
      res.send("Ispit nije uspjesno spasen");
    });
});
//#endregion

app.patch("/ispit/:ispitID", async (req, res) => {
  const { ispitID } = req.params;
  const {
    brojStudenata,
    tipIspita,
    rokPrijave,
    sala,
    termin,
    vrijemeTrajanja,
    kapacitet,
    napomena
  } = req.body;

  try {
    let ispiti = await db.Ispit.find({ where: { idIspit: ispitID } });
    if (ispiti == null)
      return res
        .status(404)
        .send({ error: "Student sa tim ID-om ne postoji!" });

    ispiti = {
      ...ispiti,
      brojStudenata,
      tipIspita,
      rokPrijave,
      sala,
      termin,
      vrijemeTrajanja,
      kapacitet,
      napomena
    };

    await db.Ispit.update(ispiti, { where: { idIspit: ispitID } });
    res.send({ success: "Uspjesan update!" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get("/dobaviIspite", async (req, res) => {
  try {
    const ispiti = await db.Ispit.findAll();
    res.send(JSON.stringify(ispiti));
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//dobavljanje ispita na koje se student moze prijaviti

app.get("/otvoreniIspiti/:studentID", async (req, res) => {
  try {
    const ispiti = await db.Ispit.findAll();
    res.send(JSON.stringify(ispiti));
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// dobavljanje aktuelnih prijava
//app.get("/otvoreniIspiti/:studentID", async (req, res) => {
//  x = Date.now()

// dobavljanje prijavljenih ispita odredjenog studenta

app.get("/prijavljeniIspiti/:studentID", async (req, res) => {
  const { studentID } = req.params;
  try {
    const ispiti = await db.Ispit.findAll({
      where: {
        termin: {
          [Op.gte]: x
        }
      }
    });
    res.send(JSON.stringify(ispiti));
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//#region primjer baze
/*app.get("/api/test", (req, res) => {
  db.Predmet.findAll({attributes: ['naziv']}).then(function(rez){
    var niz=[];
    for (var i=0; i<rez.length; i++) {
        console.log(rez[i].naziv)
    }
    res.send(rez);   
  });
});
*/
//#endregion

// let ispiti = [{ id: 5, ispit: "LD" }];

// app.get("/ispiti", (req, res) => {
//   res.send(JSON.stringify(ispiti));
// });

// //Brisanje ispita
// app.delete("/ispit/:ispitID", async (req, res) => {
//   const { ispitID } = req.params;
//   console.log(ispitID);
//   //TODO: Provjeri da li je korisnik profesor
//   //Provjeri da li je validan id
//   //Provjeri ako ima taj ispit u bazi
//   // Obrisi;
//   try {
//     ispiti = await ispiti.filter(ispit => ispit.id != ispitID);
//     console.log(ispiti);
//     res.send("Uspjesno obrisan ispit");
//   } catch (err) {
//     res.send(err.message);
//   }
// });

//Server
app.listen(port, () => console.log(`Server pokrenut na portu ${port}`));
//

module.exports = app;
