'use strict'
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const repository = (db) => {

  async function getIspiti ()  {
    return db.Ispit.findAll()
  }

  async function getIspitiById  (ispitID) {
    return db.Ispit.findOne({ where: { idIspit: ispitID } });    
  }

  async function findAndCountAllPredmetiByIdAndType (id, tipIspita) {
    return db.Ispit.findAndCountAll(
                  {
                    where: { idPredmet: id, tipIspita: tipIspita }
                  }).then(function(count) {
                    resolve(count);
                  })
}

async  function getKreiraniIspitiByProfesorId (profesorID, trenutni) {
      return db.Ispit.findAll({
                  where: {
                  idProfesor: profesorID,
                  termin: {
                      $gte: trenutni
                  }
                  }
              });
  }

  async function updateIspit (ispit, ispitID) {
      return db.Ispit.update(ispit, { where: { idIspit: ispitID } });


  }

  async function getPrijavljeniIspitiByStudentId (studentID) {
      return db.IspitiRezultati.find({
            korisnikIdKorisnik: studentID
          })
  } 

  async function getIspitiZaPrijavu (studentID) {
      return db.Ispit.findAll();
  }

  async function getKreiraniIspitiByPredmetId (predmetID, trenutni)  {
      return  db.Ispit.findAll({
          where: {
            idPredmet: predmetID,
            termin: {
              $lte: trenutni
            }
          }
        });
  }

  async function postIspit (tijelo) {
    return new Promise((resolve, reject) => {
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
          if (zapis) resolve("Uspjesno unesen ispit!");
        })
        .catch(() => {
          reject("Ispit nije uspjesno spasen");
        });
    })
  }

  return Object.create({
    getIspiti,
    getIspitiById,
    getIspitiZaPrijavu,
    getKreiraniIspitiByPredmetId,
    getKreiraniIspitiByProfesorId,
    getPrijavljeniIspitiByStudentId,
    findAndCountAllPredmetiByIdAndType,
    updateIspit,
    postIspit
  })
}

const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('connection db not supplied!'))
    }
    resolve(repository(connection))
  })
}

module.exports = Object.assign({}, {connect})

  


