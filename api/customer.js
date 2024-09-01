const Customer = require("../models/Customer");
const { verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken } = require("./verifyToken");
const router = require("express").Router();

// CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newCustomer = new Customer(req.body);
  try {
    const savedCustomer = await newCustomer.save();
    res.status(200).json(savedCustomer);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create customer",
      error: err.message
    });
  }
});

// GET CUSTOMER
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch customer",
      error: err.message
    });
  }
});

// GET CUSTOMER PROFILE
router.get('/customer', verifyToken, async (req, res) => {
  try {
    console.log("Fetching customer profile for user ID:", req.user.id); // Debugging line
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching customer profile:", err); // Debugging line
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET ALL CUSTOMERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch customers",
      error: err.message
    });
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update customer",
      error: err.message
    });
  }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer has been deleted" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete customer",
      error: err.message
    });
  }
});

module.exports = router;