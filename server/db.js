/*const mysql = require('mysql');

const connection = mysql.createConnection({
    host     :  "37.59.55.185",
    database :  "TYQcLL35gV",
    user     :  "TYQcLL35gV",
    password :  "BLysSj9ZrP",
});

const konekcijaNaBazu = () => {
    connection.connect((err)  => {
        if (err) { console.error('Error connecting: ' + err.stack); return; }
        console.log('Connected to the peca remote db: ' + connection.threadId);
    });
}*/
const Sequelize = require("sequelize");
const sequelize = new Sequelize("TYQcLL35gV","TYQcLL35gV","BLysSj9ZrP",{ host:"37.59.55.185", dialect:"mysql"});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.Ispit = sequelize.import("../models/Ispit.js");
db.Rezultati = sequelize.import("../models/ispiti_rezultati.js");
db.Predmet = sequelize.import("../models/Predmet.js");

module.exports=db;

//module.exports.connection = connection;
//module.exports.konektuj = konekcijaNaBazu;


//with out any
