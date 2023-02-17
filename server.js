const express = require("express");
const app = express();
const { Pool } = require("pg");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

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

app.get("/customers/:id", function (req, res) {
  const custId = parseInt(req.params.id);
  db.query(
    "SELECT id, name, city, phone FROM customers WHERE id = $1",
    [custId],
    function (err, result) {
      if (err) {
        console.error(err);
        res.status(500).send("Error retrieving customer from database");
      } else {
        res.json(result.rows[0]);
        console.log(result.rows[0]);
      }
    }
  );
});
app.get("/customers/by_city/:city", function (req, res) {
  const city = req.params.city;
  console.log(city);
  db.query(
    "SELECT id, name, city, phone FROM customers WHERE city like $1 || '%'",
    [city],
    function (err, result) {
      if (err) {
        console.error(err);
        res.status(500).send("Error retrieving customer from database");
      } else {
        res.json(result.rows);
        console.log(result.rows);
      }
    }
  );
});

app.post("/customers", function (req, res) {
  const newName = req.body.name;
  const newEmail = req.body.email;
  const newPhone = req.body.phone;
  const newCountry = req.body.country;

  if (!newName || !newEmail || !newPhone || !newCountry) {
    return res.status(400).send("Missing required field(s).");
  }

  const query =
    "INSERT INTO customers (name, email, phone, country) " +
    "VALUES ($1, $2, $3, $4) returning id";

  db.query(query, [newName, newEmail, newPhone, newCountry], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error creating customer.");
    }
    const newID = result.rows[0].id;
    res.send(`New customer added. New Id = ${newID}`);
  });
});

app.put("/customers/:id", function (req, res) {
  const custID = req.params.id;
  const newEmail = req.body.email;
  const newPhone = req.body.phone;

  const query = "UPDATE customers SET email=$2, phone=$3 WHERE id=$1";

  db.query(query, [custID, newEmail, newPhone], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error updating customer.");
    }
    res.send(`Customer Id = ${custID} information updated`);
  });
});

app.delete("/customers/:id", function (req, res) {
  const custID = req.params.id;

  const query = "DELETE FROM customers WHERE id=$1";

  db.query(query, [custID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error deleting customer.");
    }
    res.send(`Customer Id = ${custID} has been deleted.`);
  });
});

app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});
