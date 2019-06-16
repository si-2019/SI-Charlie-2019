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
                  }) ;
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
      return db.sequelize.query("SELECT id, idIspita, idKorisnika, bodovi FROM IspitBodovi WHERE idKorisnika = " + studentID, { type: db.sequelize.QueryTypes.SELECT}) 
  } 

  async function getPrijavljeniIspitiByIspitId (ispitID){
    return db.sequelize.query("SELECT id, idIspita, idKorisnika, bodovi FROM IspitBodovi WHERE idIspita = " + ispitID, { type: db.sequelize.QueryTypes.SELECT}) 
  }

  async function getIspitiZaPrijavu (studentID) {
      return db.Ispit.findAll();
  }

  async function deleteIspit(ispitID){
    return db.Ispit.destroy({  
              where: { idIspit : ispitID }
            })
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

  async function prijaviIspit (idIspita, idStudenta){
    return new Promise((resolve, reject) => {
      db.IspitBodovi.insertOrUpdate({
        idIspita: idIspita,
        idKorisnika: idStudenta,
        bodovi: null
      }).then(function(rez) {
        if(rez) resolve("Uspjesno prijavljen ispit");
      }).catch(() => {
        reject("Ispit nije uspjesno prijavljen");
      });
    })
  }
  
  async function odjaviIspit (idIspita, idStudenta) {
    return new Promise((resolve, reject) => {
      db.IspitBodovi.destroy({ where: { idIspita: idIspita, idKorisnika: idStudenta } 
      }).then(function(rez){
        if(rez) resolve("Uspjesno odjavljen ispit");
      }).catch(() => {
        reject("Ispit nije uspjesno odjavljen");
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
    getPrijavljeniIspitiByIspitId,
    findAndCountAllPredmetiByIdAndType,
    updateIspit,
    postIspit,
    prijaviIspit,
    odjaviIspit,
    deleteIspit
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

  


