const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Thinh.med93', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
