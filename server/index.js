require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

// Load private keys from environment variables
const privateKey = {
  PRIVATE_KEY1: process.env.PRIVATE_KEY1,
  PRIVATE_KEY2: process.env.PRIVATE_KEY2,
  PRIVATE_KEY3: process.env.PRIVATE_KEY3,
};

const balances = {
  "03fbe8ad217437062228cc5adfb50108e0faf7a8a9cf783abf30bdd7960a19f57a": 100,
  "02d0feebd20065d28bdc2ffc93da4de5648a0384280c6a8ceca934bfa0a962e539": 50,
  "035839423dba600a9b14b82b82bc0fe3fe545f0a8cb11774049097aaa043b89b7e": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] = Number(balances[recipient]) + Number(amount); // Convert to numbers and perform addition
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
