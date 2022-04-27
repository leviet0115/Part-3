require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const person = require("./models/person");

const app = express();

//middle ware
app.use(express.static("build"));

app.use(cors());

app.use(express.json());

morgan.token("data", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }

  return " ";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

//api routes
app.get("/api/persons", (req, res) => {
  Person.find({}).then((results) => {
    console.log(results);
    res.json(results);
  });
});

app.get("/info", (req, res) => {
  const reqTime = new Date(Date.now()).toString();
  const resMsg =
    `Phonebook has info for ${persons.length} persons.` + "<br/>" + reqTime;
  res.send(resMsg);
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((result) => res.json(result))
    .catch((err) => {
      console.log(err);
      res.status(404).end();
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== Number(id));
  res.status(204).end();
  console.log(persons);
});

app.post("/api/persons", (req, res) => {
  const data = req.body;

  if (!data.name) {
    return res.status(400).json({ error: "Name is missing." });
  }

  if (!data.number) {
    return res.status(400).json({ error: "Number is misisng." });
  }
  Person.find({ name: data.name }).then((result) => {
    if (result.length > 0) {
      return res.status(400).json({ error: "Name must be uniques" });
    } else {
      const newPerson = new Person({
        name: data.name,
        number: data.number,
      });
      newPerson.save().then((savedPerson) => res.json(savedPerson));
    }
  });
});

//Porting
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
