// we load all the depencies we need
const {EventEmitter} = require('events')
const server = require('./server')
const repository = require('./repository')
const config = require('./config')
const Sequelize = require("sequelize");
const mediator = new EventEmitter()

// verbose logging when we are starting the server
console.log('--- Ispiti Service ---')
console.log('Connecting to ispiti repository...')

// log unhandled execpetions
process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err)
})
process.on('uncaughtRejection', (err, promise) => {
  console.error('Unhandled Rejection', err)
})

const db = require("./db.js");
const Op = Sequelize.Op;
db.sequelize.sync();
let rep

repository.connect(db).then(repo => {
        console.log('Repositorij konektovan. Startanje servera')
        rep = repo
        return server.start({
            port: config.serverSettings.port,
            repo
        })
    })
    .then(app => {
        console.log(`Server uspjesno pokrenut na portu: ${config.serverSettings.port}.`)
    })


