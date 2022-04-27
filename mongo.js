const mongoose = require("mongoose");

if (process.argv.length < 4) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password> <name-to-add> <number-to-add>"
  );
  process.exit(1);
}

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];

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

const person = new Person({
  name: newName,
  number: newNumber,
});

person.save().then((result) => {
  console.log(`added ${result.name} number ${result.number} to phonebook`);
  mongoose.connection.close();
});

//PpE0ECkrNj2dCNdS
