const mongoose = require('mongoose');
const Cart = require("../models/Cart"); // Correctly capitalized
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const newCart = new Cart({
      OrderItem: req.body.OrderItem, 
      totalprice: req.body.totalprice, 
    });

    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create cart",
      error: err.message,
    });
  }
});

// UPDATE
router.put("/:cartId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.cartId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:cartId", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.cartId);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch cart",
      error: err.message
    });
  }
});

// Get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
