'use strict'
const express = require('express')
const ispitiAPI = require('./ispiti')
const bodyParser = require("body-parser");
const cors = require('cors')


const start = (options) => {
  return new Promise((resolve, reject) => {
    //Verifikacija repozitorija i porta
    if (!options.repo) {
      reject(new Error('Server se mora pokrenuti sa konektovanim repozitorijem'))
    }
    if (!options.port) {
      reject(new Error('Server mora biti pokrenut na dostupnom portu'))
    }
    
    const app = express()
    app.use((err, req, res, next) => {
      reject(new Error('Doslo je do greske!, greska:' + err))
      res.status(500).send('Doslo je do greske!')
    })

    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    app.use(cors())
    
    //Dodavanje api-ja
    ispitiAPI(app, options)
    
    //Pokretanje servera, vraca se novo-pokrenuti server
    const server = app.listen(options.port, () => resolve(server))
  })
}

module.exports = Object.assign({}, {start})