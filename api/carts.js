
const cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart({
    userId: req.user.id,
    books: req.body.books
  });

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create cart",
      error: err.message
    });
  }
});

//UPDATE
router.put("/:bookId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedcart = await cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedcart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:bookId", verifyTokenAndAdmin, async (req, res) => {
  try {
    await cart.findByIdAndDelete(req.params.id);
    res.status(200).json("cart has been deleted...");
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


//Get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
      const carts = await cart.find();
      res.status(200).json(carts);
    } catch (err) {
      res.status(500).json(err);
    }
  });



module.exports = router;