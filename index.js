const express = require("express");
const cors = require("cors");
const app = express();
const processRoute = require("./routes/process.route");

const { sequelize } = require("./models");
require("dotenv").config();

const db = sequelize;
// for dev db.sync({ force: true }).then(() => {
// 	console.log("Drop and re-sync db.");
// });
db.sync();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// simple route
app.use(processRoute);

//listen to the server
const PORT = process.env.PORT || 2021;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
