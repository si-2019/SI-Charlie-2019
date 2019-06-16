

module.exports = (app, options) => {
  const {repo} = options
  
  //#region get zahtjev za broj ispita (odredjenog tipa) odabranog predmeta
app.get("/predmet/:idPredmeta/:tipIspita", (req, res, next) => {
      repo.findAndCountAllPredmetiByIdAndType(req.params.idPredmeta, req.params.tipIspita).then(function(count) {
        res.status(200);
        res.json(count);
      }).catch(next);
    });
  //#endregion
  
  //#region get zahtjev za predmete - druga grupa
 /* app.get("/api/predmeti", (req, res, next) => {
    const predmeti = [
      { naziv: "Softverski inženjering", br_studenata: 150 },
      { naziv: "Logički dizajn", br_studenata: 165 },
      { naziv: "Računarske arhitekture", br_studenata: 170 }
    ];
    res.status(200);
    res.json(predmeti);
  });
  //#endregion
  */
   app.get("/jenkins-test", (req, res) => {
    res.send("Jenkins works!");
  });
  
  //#region get zahtjev za broj studenata na predmetu - druga grupa
  app.get("/dobavistudente/brojStudenata/:naziv", (req, res, next) => {
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
  
  //#region get zahtjev za jedan ispit
  app.get("/ispit/:ispitID", async (req, res, next) => {
    const { ispitID } = req.params;
    
      repo.getIspitiById(ispitID).then(function(rez) {
        if (rez == null)
        return res.status(404).send({ error: "Ispit sa tim ID-em ne postoji!" });
        res.status(200);
        res.send(JSON.stringify(rez));
      }).catch(next); 
  });
  //#endregion
  
  //#region vraća sve kreirane ispite za određenog profesora, ali koji još nisu prošli
  app.get("/kreiraniIspiti/:profesorID", async (req, res, next) => {
    const { profesorID } = req.params;
    var trenutni = new Date();
    
      repo.getKreiraniIspitiByProfesorId(profesorID, trenutni).then(function(rez) {
        if (rez == null)
        return res.status(404).send({ error: "Profesor sa tim ID-em ne postoji!" });
        res.status(200);
        res.send(JSON.stringify(rez));      
  }).catch(next);
});
//#endregion

  //#region vraća sve kreirane ispite za određeni predmet
  app.get("/kreiraniIspiti/predmet/:predmetID", async (req, res, next) => {
    const { predmetID } = req.params;
    var trenutni = new Date();
    repo.getKreiraniIspitiByPredmetId(predmetID, trenutni).then(function(rez) {
        if (rez == null)
        return res.status(404).send({ error: "Predmet sa tim ID-em ne postoji!" });
        res.status(200);
        res.send(JSON.stringify(rez));
  }).catch(next);
  });
  //#endregion
  
  //#region dobavljanje prijavljenih ispita odredjenog studenta
  app.get("/prijavljeniIspiti/:studentID", async (req, res, next) => {
    const { studentID } = req.params;
    repo.getPrijavljeniIspitiByStudentId(studentID).then(function(rez) {
      if (rez == null)
      return res.status(404).send({ error: "Ne postoji student sa tim id-em!" });
      res.status(200);
      res.send(JSON.stringify(rez)); 
  }).catch(next);
});
  //#endregion

  //#region dobavljanje prijavljenih studenata za odredjeni ispit
  app.get("/prijavljeniStudenti/:ispitID", async (req, res, next) => {
    const { ispitID } = req.params;
    repo.getPrijavljeniIspitiByIspitId(ispitID).then(function(rez) {
      if (rez == null)
      return res.status(404).send({ error: "Ne postoji ispit sa tim id-em!" });
      res.status(200);
      res.send(JSON.stringify(rez)); 
  }).catch(next);
});
  //#endregion

  //#region upis ispita 
  app.post("/ispit", (req, res, next) => {
    var tijelo = req.body;
    repo.postIspit(tijelo)
      .then(function(zapis) {
        if (zapis) res.send("Uspjesno unesen ispit!");
      })
      .catch((err) => {
        res.status(409);
        res.send("Ispit nije uspjesno spasen\n" + err);
      });
  });
  //#endregion
  
  //#region delete ispit 
  app.delete("/ispit/:ispitID", (req, res, next) => {
    const { ispitID } = req.params;
    repo.deleteIspit(ispitID)
      .then(function(zapis) {
        if (zapis) res.send("Uspjesno obrisan ispit!");
      })
      .catch((err) => {
        res.status(409);
        res.send("Ispit nije uspjesno obrisan\n" + err);
      });
  });
  //#endregion

  //#region patch
  app.patch("/ispit/:ispitID", async (req, res, next) => {
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
  
      repo.getIspitiById(ispitID).then(function(rez) {
        if (rez == null)
        return res.status(404).send({ error: "Ne postoji student sa tim id-em!" });
        
        let ispiti = {
          // ...ispiti,
          brojStudenata,
          tipIspita,
          rokPrijave,
          sala,
          termin,
          vrijemeTrajanja,
          kapacitet,
          napomena
        };
    
        repo.updateIspit(ispiti, ispitID);
        res.send({ success: "Uspjesan update!" });
    }).catch(next);
  });
  //#endregion
  
  //#region get sve ispite
  app.get("/ispiti", async (req, res, next) => {
    repo.getIspiti().then(function(rez) {
        if (rez == null)
          return res.status(404).send({ error: "Nema kreiranih ispita!" });
        res.status(200);
        res.send(JSON.stringify(rez)); 
    }).catch(next);
    
  });
  //#endregion

  //#region dobavljanje ispita na koje se student moze prijaviti
  app.get("/otvoreniIspiti/:studentID", async (req, res, next) => {
    repo.getIspitiZaPrijavu(req.params.studentID).then(function(rez) {
      if (rez == null)
        return res.status(404).send({ error: "Ne postoji student sa tim id-em!" });
      res.status(200);
      res.send(JSON.stringify(rez)); 
  }).catch(next);    
  });
  //#endregion
  
  //#region za prijavu ispita
  app.post("/prijava/:ispitID/:studentID", async (req, res, next) => {
    repo.prijaviIspit(req.params.ispitID, req.params.studentID).then(function(rez) {
        if (rez) res.send("Uspjesno prijavljen ispit!");
    }).catch(next);
  });
  //#endregion
  
  //#region za odjavu sa ispita
  app.delete("/prijava/:ispitID/:studentID", async (req, res, next) => {
    repo.odjaviIspit(req.params.ispitID, req.params.studentID).then(function(rez) {
        if (rez) res.send("Uspjesno odjavljen ispit!");
    }).catch(next);
  });
  //#endregion
  
  //#region za dobavljanje vremena do ispita
  app.get('/vrijemeDoIspita/:ispitID', async (req, res) => {
    const { ispitID } = req.params
    try {
      const exam = await repo.getIspitiById(ispitID)
      const timeLeft = Date.now() - exam.rokPrijave
      res.send({
        hours: (new Date(timeLeft)).getHours(),
        minutes: (new Date(timeLeft)).getMinutes()
      }) 
    } 
    catch (error) {
      res.status(400).send({error: error.message})
    }
  })
}
