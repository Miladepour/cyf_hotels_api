const express = require("express");
const app = express();
const { Pool } = require("pg");

app.get("/", (req, res) => {
  res.send("Hotel Database Project Home Page");
});

const db = new Pool({
  user: "miladebrahimpour", // replace with you username
  host: "localhost",
  database: "cyf_hotel",
  password: process.env.USER_PASS,
  port: 5432,
});

app.get("/customers", function (req, res) {
  db.query("SELECT id, name, city, phone FROM customers", (error, result) => {
    res.json(result.rows);
  });
});

app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});
