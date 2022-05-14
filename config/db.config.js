require("dotenv").config();
const { NODE_ENV, DB_USER, DB_HOST, DB_PASSWORD, DB } = process.env;
const prod = NODE_ENV === "production";

const dbConfig = {
  HOST: DB_HOST,
  USER: DB_USER,
  PASSWORD: DB_PASSWORD,
  DB: DB,
  dialect: "mysql",

  // Production Mode
  ...(prod && {
    USER: DB_USER,
    HOST: DB_HOST,
    PASSWORD: DB_PASSWORD,
    DB: DB,
  }),
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    // @see https://github.com/sequelize/sequelize/issues/8019
    decimalNumbers: true,
    maxPreparedStatements: 50000,
  },
};

module.exports = dbConfig;
