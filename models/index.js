const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  logging: false,

  pool: {
    ...dbConfig.pool,
  },
});

const State = require("./state.model")(sequelize, DataTypes, Sequelize);
const Service = require("./service.model")(sequelize, DataTypes, Sequelize);
const Stage = require("./stages.model")(sequelize, DataTypes, Sequelize);
const ArtisanComplete = require("./artisan_complete.model")(
  sequelize,
  DataTypes,
  Sequelize
);
const CustomerComplete = require("./customer_complete.model")(
  sequelize,
  DataTypes,
  Sequelize
);

module.exports = {
  State,
  Service,
  Stage,
  ArtisanComplete,
  CustomerComplete,
  sequelize,
};
