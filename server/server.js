const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
//

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
app.get('/dobavistudente/brojStudenata/:naziv', (req, res) => {
  const predmeti = [
    {naziv: 'Softverski inženjering', br_studenata: 150},
    {naziv: 'Logički dizajn', br_studenata: 165},
    {naziv: 'Računarske arhitekture', br_studenata: 170}
  ];
  var br=0;
    predmeti.forEach(predmet => {
        if(req.params.naziv==predmet.naziv) br=predmet.br_studenata;
    });
    res.status(200);
    res.json(br);
});

app.post('/ispit', (req, res) => {
  let v=req.body.ok;
  if(v) res.send("Uspjesno ste kreirali ispit");
  res.send("Doslo je do greske pri kreiranju ispita");
  
});

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
