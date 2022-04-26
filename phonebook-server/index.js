const express = require("express");
const morgan = require("morgan");

const app = express();

morgan.token("data", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }

  return " ";
});

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const reqTime = new Date(Date.now()).toString();
  const resMsg =
    `Phonebook has info for ${persons.length} persons.` + "<br/>" + reqTime;
  res.send(resMsg);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === Number(id));
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== Number(id));
  res.status(204).end();
  console.log(persons);
});

app.post("/api/persons", (req, res) => {
  const data = req.body;
  const createId = () => persons[persons.length - 1].id + 1;

  if (!data.name) {
    return res.status(400).json({ error: "Name is missing." });
  }

  if (!data.number) {
    return res.status(400).json({ error: "Number is misisng." });
  }

  if (persons.find((person) => person.name === data.name)) {
    return res.status(400).json({ error: "Name must be unique!" });
  }

  const person = {
    id: createId(),
    name: data.name,
    number: data.number,
  };

  persons.push(person);

  console.log(persons);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
