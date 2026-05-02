const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let products = [
  { id: 1, name: "ساعة ذكية", price: 219, category: "Electronics" },
  { id: 2, name: "حقيبة الظهر", price: 199, category: "Fashion" },
  { id: 3, name: "سماعات", price: 99, category: "Electronics" }
];

let orders = [];

// GET products
app.get("/products", (req, res) => {
  res.json(products);
});

// ADD product
app.post("/products", (req, res) => {
  const product = { id: Date.now(), ...req.body };
  products.push(product);
  res.json(product);
});

// DELETE product
app.delete("/products/:id", (req, res) => {
  products = products.filter(p => p.id != req.params.id);
  res.json({ success: true });
});

// CREATE order
app.post("/orders", (req, res) => {
  const order = { id: Date.now(), ...req.body };
  orders.push(order);
  res.json(order);
});

// GET orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

 export default app;