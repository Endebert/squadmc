const express = require("express");
const path = require("path");
const compression = require("compression");

const PORT = process.env.PORT || 5000;

express()
  .use(compression())
  .use(express.static(path.join(__dirname, "public")))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
