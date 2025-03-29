const { Sequelize } = require('sequelize');
const config = require('./config/config').db;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    pool: config.pool,
    logging: false, 
  }
);


module.exports = { sequelize };
