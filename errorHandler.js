const errorHandler = (err, req, res, next) => {
  console.log(err);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  return res.status(500).end();
};

module.exports = errorHandler;
