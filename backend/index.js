const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("LTI 1.3 Tool Running 🚀");
});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});