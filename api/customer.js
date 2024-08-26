const Customer = require("../models/Customer");
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken");
const router = require("express").Router();

// CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newCustomer = new Customer(req.body);
  try {
    const savedCustomer = await newCustomer.save();
    res.status(200).json(savedCustomer);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET CUSTOMER
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Other CRUD operations...

module.exports = router;