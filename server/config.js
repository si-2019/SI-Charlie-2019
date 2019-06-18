const dbSettings = {
  user: 'TYQcLL35gV',
  database: 'TYQcLL35gV',
  pass: 'BLysSj9ZrP',
  host: "mysql-3213-0.cloudclusters.net",
  dialect: 'mysql',
  port: 10021
};

// server parameters
const serverSettings = {
  port: process.env.PORT || 31903
};

module.exports = Object.assign({}, { dbSettings, serverSettings });
