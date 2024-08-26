const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  books: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ]
});

const Cart = mongoose.model('Cart', CartSchema);



module.exports = Cart;