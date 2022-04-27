const mongoose = require("mongoose");

const input = process.argv;

if (input.length < 3) {
  console.log(
    "Please provide the password as an argument: \n node mongo.js <password> <name-to-add> <number-to-add> \n or node mongo.js <password> "
  );
  process.exit(1);
}

const password = input[2];

const URL = `mongodb+srv://sipylia:${password}@cluster0.mhwth.mongodb.net/FullstackOpen?retryWrites=true&w=majority`;

mongoose.connect(URL);

const personSchema = new mongoose.Schema(
  {
    name: String,
    number: String,
  },
  { collection: "phonebook" }
);

const Person = mongoose.model("Person", personSchema);

if (input.length === 3) {
  Person.find({})
    .then((result) => {
      console.log("Phonebook:");
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
        mongoose.connection.close();
      });
    })
    .then(() => process.exit(1));
}

if (input.length == 5) {
  const newName = input[3];
  const newNumber = input[4];

  const person = new Person({
    name: newName,
    number: newNumber,
  });

  person
    .save()
    .then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
      mongoose.connection.close();
    })
    .then(() => process.exit(1));
}
