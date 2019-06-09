const dbSettings = {
  user: 'TYQcLL35gV',
  database: 'TYQcLL35gV',
  pass: 'BLysSj9ZrP',
  host: '37.59.55.185',
  dialect: 'mysql'
};

// server parameters
const serverSettings = {
  port: process.env.PORT || 31903
};

module.exports = Object.assign({}, { dbSettings, serverSettings });
