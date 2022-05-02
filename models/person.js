const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB.", err.message));

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "The name must have at least 3 characters."],
    },
    number: {
      type: String,
      minLength: [8, "The number must have at least 8 characters"],
      validate: {
        validator: (number) => /^\d{2,3}\-\d+$/.test(number),
        message:
          "The phone number must be separated into to two parts with a dash (-) and the first part should has 2-3 numbers.",
      },
    },
  },
  { collection: "phonebook" }
);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
