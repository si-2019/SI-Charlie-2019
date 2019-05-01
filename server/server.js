const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 31903;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
const Sequelize = require('sequelize');
const db = require('./db.js')
db.sequelize.sync();
//

app.use("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

//get zahtjev za predmete
app.get("/api/predmeti", (req, res) => {
  const predmeti = [
    { naziv: "Softverski inženjering", br_studenata: 150 },
    { naziv: "Logički dizajn", br_studenata: 165 },
    { naziv: "Računarske arhitekture", br_studenata: 170 }
  ];
  res.status(200);
  res.json(predmeti);
});

//get zahtjev za broj predmeta
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

app.post("/addIspit", (req, res) => {
  var tijelo = req.body;
  var idProfesora = tijelo['idProfesora'];
  var idPredmeta = tijelo['idPredmeta'];
  var brojStudenata = tijelo['brojStudenata'];
  var tipIspita = tijelo['tipIspita'];
  var rokPrijave = tijelo['rokPrijave'];
  var sala = tijelo['sala'];
  var termin = tijelo['termin'];
  var vrijemeTrajanja = tijelo['vrijemeTrajanja'];
  var kapacitet = tijelo['kapacitet'];
  var napomena = tijelo['napomena'];
  db.Ispit.insertOrUpdate({
    idProfesora:idProfesora,
    idPredmeta:idPredmeta,
    brojStudenata:brojStudenata,
    tipIspita:tipIspita,
    rokPrijave:rokPrijave,
    sala:sala,
    termin:termin,
    vrijemeTrajanja:vrijemeTrajanja,
    kapacitet:kapacitet,
    napomena:napomena
  }).then(function(zapis){
    if(zapis) res.send("Uspjesno unesen ispit!")
  })

})


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
