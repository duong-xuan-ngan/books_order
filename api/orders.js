const mongoose = require('mongoose');
const Customer = require("../models/Customer");
const Order = require("../models/Orders");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

// Add to cart
router.post("/cart/add", verifyToken, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const customerId = req.user.id;

    let order = await Order.findOne({ customerId, status: 'cart' });

    if (!order) {
      order = new Order({
        customerId,
        books: [{ bookId, quantity }],
        status: 'cart',
        totalAmount: 0 // You'll need to calculate this
      });
    } else {
      const existingBookIndex = order.books.findIndex(item => item.bookId.toString() === bookId);
      if (existingBookIndex > -1) {
        order.books[existingBookIndex].quantity += quantity;
      } else {
        order.books.push({ bookId, quantity });
      }
    }

    // Recalculate total amount
    // You'll need to fetch book prices and calculate the total

    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({
      message: "Failed to add item to cart",
      error: err.message
    });
  }
});
// UPDATE
router.put("/:orderId", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,  // Use orderId to find and update the order
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:orderId", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.orderId);  
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});


//GET Order
router.get("/find/:customerId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    console.log("Querying for customerId:", req.params.customerId);
    const orders = await Order.find({ customerId: new mongoose.Types.ObjectId(req.params.customerId) });
    console.log("Query result:", orders);
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json(err);
  }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  // GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;