const config = require('./config')
const Sequelize = require("sequelize");
const sequelize = new Sequelize("TYQcLL35gV","TYQcLL35gV","BLysSj9ZrP",{ host: "37.59.55.185", dialect: 'mysql'});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.Ispit = sequelize.import("../models/Ispit.js");
db.Predmet = sequelize.import("../models/Predmet.js");
db.Student = sequelize.import("../models/Korisnik.js");

db.IspitBodovi = sequelize.import("../models/ispiti_rezultati.js")
db.Student.belongsToMany(db.Ispit, {through: 'IspitBodovi'});
db.Ispit.belongsToMany(db.Student, {through: 'IspitBodovi'});



module.exports=db;

