const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();
app.set('view engine', 'ejs');


var corsOptions = {
  origin: "http://localhost:8081"
};
const MyModel = require('./app/models');
app.use(cors(corsOptions));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const tutorials = require("./app/controllers/tutorial.controller.js");

const users = require("./app/controllers/user.controller.js");

const db = require("./app/models");
db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/turorial.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Create a new record
app.post("/add", async (req, res) => {
  try {
    const { title, description, published } = req.body;
    const tutorials = await db.tutorials.create({ title, description, published });
    res.json(tutorials);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/addUser", async (req, res) => {
  try {
    const {name, email, password } = req.body;
    const users = await db.users.create({ name, email, password });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get('/users', users.findAll);

app.get('/tutorials', tutorials.findAll);



//find by title
app.get('/tutorial/', tutorials.findOne);


