require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const errorHandler = require("./errorHandlers/errorHandler");

const app = express();

//middle ware
app.use(express.static("build"));

app.use(cors());

app.use(express.json());

morgan.token("data", (req) => {
  if (req.method === "POST") return JSON.stringify(req.body);
  return " ";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

//api routes
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((results) => res.json(results))
    .catch((err) => next(err));
});

app.get("/info", (req, res, next) => {
  const reqTime = new Date(Date.now()).toString();
  Person.countDocuments({})
    .then((result) =>
      res.send(`Phonebook has info for ${result} persons.` + "<br/>" + reqTime)
    )
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((result) => {
      if (result) return res.json(result);
      return res.status(404).end();
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      if (result) return res.status(204).end();
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const data = req.body;

  Person.find({ name: data.name }).then((result) => {
    if (result.length > 0) {
      return res.status(400).send({ error: "Name must be uniques" });
    } else {
      const newPerson = new Person({
        name: data.name,
        number: data.number,
      });
      newPerson
        .save()
        .then((savedPerson) => res.json(savedPerson))
        .catch((err) => next(err));
    }
  });
});

app.put("/api/persons/:id", (req, res, next) => {
  const data = req.body;

  const person = {
    name: data.name,
    number: data.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => {
      if (result) return res.json(result);
      return res.status(404).end();
    })
    .catch((err) => next(err));
});

app.use(errorHandler);

//Porting
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
